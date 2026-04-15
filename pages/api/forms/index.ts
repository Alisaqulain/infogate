import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/db";
import { FormSubmission } from "@/models/FormSubmission";
import { sendAdminNotification } from "@/lib/mailer";
import { getAdminFromRequest } from "@/lib/adminAuth";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    if (!getAdminFromRequest(req)) return res.status(401).json({ error: "Unauthorized" });
    await dbConnect();
    const items = await FormSubmission.find().sort({ createdAt: -1 }).limit(200).lean();
    return res.status(200).json({ ok: true, items: items.map((f) => ({ id: f._id.toString(), ...f })) });
  }

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const body = (req.body ?? {}) as Record<string, unknown>;
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (name.length < 2) return res.status(400).json({ error: "Invalid name" });
  if (!emailRe.test(email)) return res.status(400).json({ error: "Invalid email" });
  if (message.length < 10) return res.status(400).json({ error: "Message is too short" });

  await dbConnect();
  const created = await FormSubmission.create({
    type: "contact",
    name,
    email,
    phone: phone || undefined,
    message,
  });

  try {
    await sendAdminNotification({
      subject: `New inquiry from ${name}`,
      text: [`Name: ${name}`, `Email: ${email}`, `Phone: ${phone || "-"}`, "", message].join("\n"),
    });
  } catch {
    // Keep request successful even if SMTP fails.
  }

  return res.status(201).json({ ok: true, id: created._id.toString() });
}
