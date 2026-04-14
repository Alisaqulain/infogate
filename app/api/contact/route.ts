import { NextResponse } from "next/server";

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

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) {
    return NextResponse.json(
      {
        error:
          "Email delivery is not configured yet. Add WEB3FORMS_ACCESS_KEY to your environment (see .env.example).",
      },
      { status: 503 },
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

  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      access_key: accessKey,
      subject: `New SEO lead — ${name}`,
      from_name: name,
      email,
      message: composed,
    }),
  });

  let data: { success?: boolean; message?: string } = {};
  try {
    data = (await res.json()) as { success?: boolean; message?: string };
  } catch {
    return NextResponse.json(
      { error: "Email service returned an invalid response." },
      { status: 502 },
    );
  }

  if (!data.success) {
    return NextResponse.json(
      { error: data.message ?? "Could not send email. Try again later." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
