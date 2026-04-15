import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/lib/adminApi";
import { verifyAccessToken } from "@/lib/auth";

function getCookie(req: NextApiRequest, name: string) {
  const raw = req.headers.cookie || "";
  const parts = raw.split(";").map((p) => p.trim());
  for (const p of parts) {
    if (p.startsWith(name + "=")) return decodeURIComponent(p.slice(name.length + 1));
  }
  return null;
}

export default requireAdmin(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  const token = getCookie(req, "admin_token");
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  const payload = verifyAccessToken(token);
  return res.status(200).json({ ok: true, email: payload.email });
});

