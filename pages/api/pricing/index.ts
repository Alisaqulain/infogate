import type { NextApiRequest, NextApiResponse } from "next";
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
  if (req.method === "GET") {
    await dbConnect();
    const items = await Pricing.find().sort({ createdAt: -1 }).lean();
    return res.status(200).json({ ok: true, items: items.map((p) => ({ id: p._id.toString(), ...p })) });
  }

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!getAdminFromRequest(req)) return res.status(401).json({ error: "Unauthorized" });

  const parsed = PricingSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid payload" });

  await dbConnect();
  const created = await Pricing.create(parsed.data);
  return res.status(201).json({ ok: true, item: { id: created._id.toString(), ...created.toObject() } });
}
