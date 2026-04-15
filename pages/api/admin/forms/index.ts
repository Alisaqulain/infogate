import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/lib/adminApi";
import { dbConnect } from "@/lib/db";
import { FormSubmission } from "@/models/FormSubmission";

export default requireAdmin(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const limitRaw = Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit;
  const typeRaw = Array.isArray(req.query.type) ? req.query.type[0] : req.query.type;
  const limit = Math.min(Math.max(parseInt(limitRaw || "50", 10) || 50, 1), 200);
  const type = typeRaw === "contact" || typeRaw === "quote" ? typeRaw : undefined;

  await dbConnect();

  const filter: Record<string, unknown> = {};
  if (type) filter.type = type;

  const [items, total] = await Promise.all([
    FormSubmission.find(filter).sort({ createdAt: -1 }).limit(limit).lean(),
    FormSubmission.countDocuments(filter),
  ]);

  return res.status(200).json({
    ok: true,
    total,
    items: items.map((i) => ({
      id: i._id.toString(),
      type: i.type,
      name: i.name,
      email: i.email,
      phone: i.phone ?? null,
      message: i.message,
      meta: i.meta ?? null,
      createdAt: i.createdAt,
    })),
  });
});

