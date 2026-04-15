import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { z } from "zod";
import { dbConnect } from "@/lib/db";
import { Service } from "@/models/Service";
import { createImageUpload, toPublicUploadPath } from "@/lib/multer";
import { getAdminFromRequest } from "@/lib/adminAuth";

const upload = createImageUpload("services");

const UpdateSchema = z.object({
  title_en: z.string().trim().min(1),
  title_ar: z.string().trim().min(1),
  description_en: z.string().trim().min(1),
  description_ar: z.string().trim().min(1),
});

function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: (req: any, res: any, cb: (result?: unknown) => void) => void
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
  const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
  if (!id || !mongoose.isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });

  if (req.method === "DELETE") {
    if (!getAdminFromRequest(req)) return res.status(401).json({ error: "Unauthorized" });
    await dbConnect();
    const deleted = await Service.findByIdAndDelete(id).lean();
    if (!deleted) return res.status(404).json({ error: "Not found" });
    return res.status(200).json({ ok: true });
  }

  if (req.method !== "PUT") return res.status(405).json({ error: "Method not allowed" });
  if (!getAdminFromRequest(req)) return res.status(401).json({ error: "Unauthorized" });

  try {
    await runMiddleware(req, res, upload.single("image"));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return res.status(400).json({ error: message });
  }

  const parsed = UpdateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid payload" });

  await dbConnect();
  const file = (req as NextApiRequest & { file?: { filename: string } }).file;
  const updateData = {
    ...parsed.data,
    ...(file ? { imagePath: toPublicUploadPath("services", file.filename) } : {}),
  };

  const updated = await Service.findByIdAndUpdate(id, updateData, { new: true }).lean();
  if (!updated) return res.status(404).json({ error: "Not found" });
  return res.status(200).json({ ok: true, item: { id: updated._id.toString(), ...updated } });
}
