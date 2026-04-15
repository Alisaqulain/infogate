import type { NextApiRequest, NextApiResponse } from "next";
import { createImageUpload, toPublicUploadPath } from "@/lib/multer";
import { getAdminFromRequest } from "@/lib/adminAuth";

const upload = createImageUpload("blogs");

function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: (req: NextApiRequest, res: NextApiResponse, cb: (result?: unknown) => void) => void
) {
  return new Promise<void>((resolve, reject) => {
    fn(req, res, (result: unknown) => {
      if (result instanceof Error) return reject(result);
      resolve();
    });
  });
}

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!getAdminFromRequest(req)) return res.status(401).json({ error: "Unauthorized" });
  try {
    await runMiddleware(req, res, upload.single("image"));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return res.status(400).json({ error: message });
  }
  const file = (req as NextApiRequest & { file?: { filename: string } }).file;
  if (!file) return res.status(400).json({ error: "Missing image file" });
  return res.status(200).json({ ok: true, url: toPublicUploadPath("blogs", file.filename) });
}
