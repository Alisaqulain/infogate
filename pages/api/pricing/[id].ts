import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { z } from "zod";
import { dbConnect } from "@/lib/db";
import { Pricing } from "@/models/Pricing";
import { getAdminFromRequest } from "@/lib/adminAuth";

const PricingSchema = z.object({
  name_en: z.string().trim().min(1),
  name_ar: z.string().trim().min(1),
  price: z.string().trim().min(1),
  features_en: z.array(z.string().trim()).default([]),
  features_ar: z.array(z.string().trim()).default([]),
  featured: z.boolean().default(false),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
  if (!id || !mongoose.isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });
  if (!getAdminFromRequest(req)) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "DELETE") {
    await dbConnect();
    const deleted = await Pricing.findByIdAndDelete(id).lean();
    if (!deleted) return res.status(404).json({ error: "Not found" });
    return res.status(200).json({ ok: true });
  }

  if (req.method !== "PUT") return res.status(405).json({ error: "Method not allowed" });
  const parsed = PricingSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid payload" });

  await dbConnect();
  const updated = await Pricing.findByIdAndUpdate(id, parsed.data, { new: true }).lean();
  if (!updated) return res.status(404).json({ error: "Not found" });
  return res.status(200).json({ ok: true, item: { id: updated._id.toString(), ...updated } });
}
