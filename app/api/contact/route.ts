import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { FormSubmission } from "@/models/FormSubmission";
import { sendAdminNotification } from "@/lib/mailer";
import { apiFieldError, apiGenericError } from "@/lib/form-api-errors";
import { isValidOptionalHttpUrl } from "@/lib/registration-validation";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiGenericError("Invalid JSON body.", 400);
  }

  if (!body || typeof body !== "object") {
    return apiGenericError("Invalid payload.", 400);
  }

  const b = body as Record<string, unknown>;
  const name = typeof b.name === "string" ? b.name.trim() : "";
  const email = typeof b.email === "string" ? b.email.trim() : "";
  const phone = typeof b.phone === "string" ? b.phone.trim() : "";
  const company = typeof b.company === "string" ? b.company.trim() : "";
  const website = typeof b.website === "string" ? b.website.trim() : "";
  const service = typeof b.service === "string" ? b.service.trim() : "";
  const message = typeof b.message === "string" ? b.message.trim() : "";

  if (name.length < 2) {
    return apiFieldError("name", "name_min");
  }
  if (!emailRe.test(email)) {
    return apiFieldError("email", "email_invalid");
  }
  if (!service) {
    return apiFieldError("service", "service_required");
  }
  if (message.length < 10) {
    return apiFieldError("message", "message_min");
  }
  if (!isValidOptionalHttpUrl(website)) {
    return apiFieldError("website", "website_invalid");
  }

  const composed = [
    `Service: ${service}`,
    phone ? `Phone: ${phone}` : null,
    company ? `Company: ${company}` : null,
    website ? `Website: ${website}` : null,
    "",
    message,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    await dbConnect();

    const submission = await FormSubmission.create({
      type: "contact",
      name,
      email,
      phone: phone || undefined,
      message,
      meta: {
        service,
        company: company || undefined,
        website: website || undefined,
        composed,
      },
    });

    let emailSent = false;
    try {
      const res = await sendAdminNotification({
        subject: `New lead — ${name}`,
        text: [
          `New form submission`,
          `Type: contact`,
          `Name: ${name}`,
          `Email: ${email}`,
          phone ? `Phone: ${phone}` : null,
          company ? `Company: ${company}` : null,
          website ? `Website: ${website}` : null,
          `Service: ${service}`,
          "",
          message,
          "",
          `MongoID: ${submission._id.toString()}`,
        ]
          .filter(Boolean)
          .join("\n"),
      });
      emailSent = res.ok;
    } catch {
      emailSent = false;
    }

    return NextResponse.json({ ok: true, emailSent });
  } catch {
    return apiGenericError("Unable to save your message. Please try again later.");
  }
}
