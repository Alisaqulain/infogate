import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { FormSubmission } from "@/models/FormSubmission";
import { sendAdminNotification } from "@/lib/mailer";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
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
    return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  }
  if (!emailRe.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }
  if (!service) {
    return NextResponse.json(
      { error: "Please choose what you need help with." },
      { status: 400 },
    );
  }
  if (message.length < 10) {
    return NextResponse.json(
      { error: "Please write a short message (at least 10 characters)." },
      { status: 400 },
    );
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
}
