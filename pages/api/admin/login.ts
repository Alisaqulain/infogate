import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { dbConnect } from "@/lib/db";
import { Admin } from "@/models/Admin";
import { hashPassword, signAccessToken, verifyPassword } from "@/lib/auth";
import type { AdminDoc } from "@/models/Admin";

const BodySchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(64)
    .regex(/^[a-zA-Z0-9_.-]+$/, "Invalid username"),
  password: z.string().min(6),
});

function normalizeUsername(raw: string): string {
  return raw.trim().toLowerCase();
}

function bootstrapUsername(): string {
  const fromEnv = (process.env.ADMIN_USERNAME || "").trim();
  if (fromEnv) return normalizeUsername(fromEnv);
  const legacyEmail = (process.env.ADMIN_EMAIL || "").trim();
  if (legacyEmail.includes("@")) {
    return normalizeUsername(legacyEmail.split("@")[0] || "admin");
  }
  return legacyEmail ? normalizeUsername(legacyEmail) : "";
}

function matchesEnvBootstrap(username: string, password: string): boolean {
  const bootUser = bootstrapUsername();
  const bootPass = process.env.ADMIN_PASSWORD || "";
  return (
    !!bootUser &&
    bootPass.length >= 6 &&
    username === bootUser &&
    password === bootPass
  );
}

async function findAdminByLogin(username: string) {
  const escaped = username.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return Admin.findOne({
    $or: [
      { username },
      { email: username },
      { email: new RegExp(`^${escaped}@`, "i") },
    ],
  });
}

/** Sync .env ADMIN_USERNAME / ADMIN_PASSWORD to the admin record (fixes legacy email-only accounts). */
async function upsertBootstrapAdmin(
  username: string,
  password: string
): Promise<AdminDoc | null> {
  if (!matchesEnvBootstrap(username, password)) return null;

  const passwordHash = await hashPassword(password);
  const existing = await Admin.findOne().sort({ createdAt: 1 });

  if (existing) {
    existing.username = username;
    existing.passwordHash = passwordHash;
    await existing.save();
    return existing;
  }

  return Admin.create({ username, passwordHash });
}

function issueSession(res: NextApiResponse, admin: AdminDoc, displayUsername: string) {
  const token = signAccessToken({
    sub: String(admin._id),
    role: "admin",
    username: displayUsername,
  });

  res.setHeader(
    "Set-Cookie",
    `admin_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`
  );

  return res.status(200).json({ ok: true });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const parsed = BodySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid payload" });

  await dbConnect();

  const username = normalizeUsername(parsed.data.username);
  const password = parsed.data.password;

  if ((await Admin.countDocuments()) === 0) {
    const synced = await upsertBootstrapAdmin(username, password);
    if (synced) {
      return issueSession(res, synced, username);
    }
  }

  const admin = await findAdminByLogin(username);

  if (admin) {
    const ok = await verifyPassword(password, admin.passwordHash);
    if (ok) {
      if (!admin.username) {
        admin.username =
          bootstrapUsername() ||
          normalizeUsername(String(admin.email ?? "").split("@")[0] || username);
        await admin.save();
      }
      return issueSession(res, admin, admin.username ?? username);
    }
  }

  const synced = await upsertBootstrapAdmin(username, password);
  if (synced) {
    return issueSession(res, synced, username);
  }

  return res.status(401).json({ error: "Invalid credentials" });
}
