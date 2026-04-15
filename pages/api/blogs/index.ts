import type { NextApiRequest, NextApiResponse } from "next";
import slugify from "slugify";
import { z } from "zod";
import { dbConnect } from "@/lib/db";
import { Blog } from "@/models/Blog";
import { createImageUpload, toPublicUploadPath } from "@/lib/multer";
import { getAdminFromRequest } from "@/lib/adminAuth";
import {
  runMulterMiddleware,
  type NextApiMulterMiddleware,
} from "@/lib/runMulterMiddleware";

const upload = createImageUpload("blogs");

const BlogSchema = z.object({
  title_en: z.string().trim().min(1),
  title_ar: z.string().trim().min(1),
  slug: z.string().trim().optional(),
  content_en: z.string().trim().min(1),
  content_ar: z.string().trim().min(1),
});

function normalizeSlug(input: string) {
  return slugify(input, { lower: true, strict: true, trim: true });
}

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    await dbConnect();
    const items = await Blog.find().sort({ createdAt: -1 }).lean();
    return res.status(200).json({
      ok: true,
      items: items.map((b) => ({ id: b._id.toString(), ...b })),
    });
  }

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!getAdminFromRequest(req)) return res.status(401).json({ error: "Unauthorized" });

  try {
    await runMulterMiddleware(
      req,
      res,
      upload.single("coverImage") as unknown as NextApiMulterMiddleware
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return res.status(400).json({ error: message });
  }

  const parsed = BlogSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid payload" });

  const content_en = JSON.parse(parsed.data.content_en) as unknown;
  const content_ar = JSON.parse(parsed.data.content_ar) as unknown;
  const desiredSlug = normalizeSlug(parsed.data.slug?.trim() || parsed.data.title_en);
  if (!desiredSlug) return res.status(400).json({ error: "Unable to generate slug" });

  await dbConnect();
  const duplicate = await Blog.findOne({ slug: desiredSlug }).lean();
  if (duplicate) return res.status(409).json({ error: "Slug already exists" });

  const file = (req as NextApiRequest & { file?: { filename: string } }).file;
  const created = await Blog.create({
    title_en: parsed.data.title_en,
    title_ar: parsed.data.title_ar,
    slug: desiredSlug,
    content_en,
    content_ar,
    coverImagePath: file ? toPublicUploadPath("blogs", file.filename) : undefined,
    published: true,
  });
  return res.status(201).json({ ok: true, item: { id: created._id.toString(), ...created.toObject() } });
}
