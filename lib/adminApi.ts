import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import { verifyAccessToken } from "@/lib/auth";

function getCookie(req: NextApiRequest, name: string) {
  const raw = req.headers.cookie || "";
  const parts = raw.split(";").map((p) => p.trim());
  for (const p of parts) {
    if (p.startsWith(name + "=")) return decodeURIComponent(p.slice(name.length + 1));
  }
  return null;
}

export function requireAdmin(handler: NextApiHandler): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = getCookie(req, "admin_token");
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    try {
      verifyAccessToken(token);
      return handler(req, res);
    } catch {
      return res.status(401).json({ error: "Unauthorized" });
    }
  };
}

