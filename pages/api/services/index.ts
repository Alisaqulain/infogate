import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { dbConnect } from "@/lib/db";
import { Service } from "@/models/Service";
import { createImageUpload, toPublicUploadPath } from "@/lib/multer";
import { getAdminFromRequest } from "@/lib/adminAuth";

const upload = createImageUpload("services");

const ServiceSchema = z.object({
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
  if (req.method === "GET") {
    await dbConnect();
    const items = await Service.find().sort({ createdAt: -1 }).lean();
    return res.status(200).json({
      ok: true,
      items: items.map((s) => ({ id: s._id.toString(), ...s })),
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const admin = getAdminFromRequest(req);
  if (!admin) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    await runMiddleware(req, res, upload.single("image"));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return res.status(400).json({ error: message });
  }

  const parsed = ServiceSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  await dbConnect();
  const file = (req as NextApiRequest & { file?: { filename: string } }).file;
  const created = await Service.create({
    ...parsed.data,
    imagePath: file ? toPublicUploadPath("services", file.filename) : undefined,
  });

  return res.status(201).json({ ok: true, item: { id: created._id.toString(), ...created.toObject() } });
}
