import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import slugify from "slugify";
import { z } from "zod";
import { dbConnect } from "@/lib/db";
import { Blog } from "@/models/Blog";
import { createImageUpload, toPublicUploadPath } from "@/lib/multer";
import { getAdminFromRequest } from "@/lib/adminAuth";

const upload = createImageUpload("blogs");

const BlogSchema = z.object({
  title_en: z.string().trim().min(1),
  title_ar: z.string().trim().min(1),
  slug: z.string().trim().optional(),
  content_en: z.string().trim().min(1),
  content_ar: z.string().trim().min(1),
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
  if (!getAdminFromRequest(req)) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "DELETE") {
    await dbConnect();
    const deleted = await Blog.findByIdAndDelete(id).lean();
    if (!deleted) return res.status(404).json({ error: "Not found" });
    return res.status(200).json({ ok: true });
  }

  if (req.method !== "PUT") return res.status(405).json({ error: "Method not allowed" });
  try {
    await runMiddleware(req, res, upload.single("coverImage"));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return res.status(400).json({ error: message });
  }

  const parsed = BlogSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid payload" });

  const slug = slugify(parsed.data.slug?.trim() || parsed.data.title_en, { lower: true, strict: true, trim: true });
  if (!slug) return res.status(400).json({ error: "Invalid slug" });

  await dbConnect();
  const duplicate = await Blog.findOne({ slug, _id: { $ne: id } }).lean();
  if (duplicate) return res.status(409).json({ error: "Slug already exists" });

  const file = (req as NextApiRequest & { file?: { filename: string } }).file;
  const updated = await Blog.findByIdAndUpdate(
    id,
    {
      title_en: parsed.data.title_en,
      title_ar: parsed.data.title_ar,
      slug,
      content_en: JSON.parse(parsed.data.content_en),
      content_ar: JSON.parse(parsed.data.content_ar),
      ...(file ? { coverImagePath: toPublicUploadPath("blogs", file.filename) } : {}),
    },
    { new: true }
  ).lean();
  if (!updated) return res.status(404).json({ error: "Not found" });

  return res.status(200).json({ ok: true, item: { id: updated._id.toString(), ...updated } });
}
