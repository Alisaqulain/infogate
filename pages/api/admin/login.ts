import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { dbConnect } from "@/lib/db";
import { Admin } from "@/models/Admin";
import { hashPassword, signAccessToken, verifyPassword } from "@/lib/auth";

const BodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const parsed = BodySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid payload" });

  await dbConnect();

  const email = parsed.data.email.toLowerCase().trim();
  const password = parsed.data.password;

  // Optional bootstrap: create first admin if none exist
  const adminCount = await Admin.countDocuments();
  if (adminCount === 0) {
    const bootstrapEmail = (process.env.ADMIN_EMAIL || "").toLowerCase().trim();
    const bootstrapPass = process.env.ADMIN_PASSWORD || "";
    if (bootstrapEmail && bootstrapPass.length >= 6) {
      const passwordHash = await hashPassword(bootstrapPass);
      await Admin.create({ email: bootstrapEmail, passwordHash });
    }
  }

  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await verifyPassword(password, admin.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = signAccessToken({ sub: String(admin._id), role: "admin", email: admin.email });

  // Store JWT in httpOnly cookie
  res.setHeader(
    "Set-Cookie",
    `admin_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`
  );

  return res.status(200).json({ ok: true });
}
