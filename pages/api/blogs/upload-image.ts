import type { NextApiRequest, NextApiResponse } from "next";
import { createImageUpload, toPublicUploadPath } from "@/lib/multer";
import { getAdminFromRequest } from "@/lib/adminAuth";
import {
  runMulterMiddleware,
  type NextApiMulterMiddleware,
} from "@/lib/runMulterMiddleware";

const upload = createImageUpload("blogs");

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!getAdminFromRequest(req)) return res.status(401).json({ error: "Unauthorized" });
  try {
    await runMulterMiddleware(
      req,
      res,
      upload.single("image") as unknown as NextApiMulterMiddleware
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return res.status(400).json({ error: message });
  }
  const file = (req as NextApiRequest & { file?: { filename: string } }).file;
  if (!file) return res.status(400).json({ error: "Missing image file" });
  return res.status(200).json({ ok: true, url: toPublicUploadPath("blogs", file.filename) });
}
