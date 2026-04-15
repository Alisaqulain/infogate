import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { verifyAccessToken } from "@/lib/auth";

function readCookie(req: NextApiRequest, name: string) {
  const cookie = req.headers.cookie ?? "";
  for (const part of cookie.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === name) return decodeURIComponent(rest.join("="));
  }
  return null;
}

export function getAdminFromRequest(req: NextApiRequest) {
  const token = readCookie(req, "admin_token");
  if (!token) return null;
  try {
    return verifyAccessToken(token);
  } catch {
    return null;
  }
}

export function withAdminGuard(handler: NextApiHandler): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const admin = getAdminFromRequest(req);
    if (!admin) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    return handler(req, res);
  };
}
