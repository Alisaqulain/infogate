import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { requireAdmin } from "@/lib/adminApi";
import { dbConnect } from "@/lib/db";
import { FormSubmission } from "@/models/FormSubmission";

export default requireAdmin(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") return res.status(405).json({ error: "Method not allowed" });

  const idRaw = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
  if (!idRaw || typeof idRaw !== "string" || !mongoose.isValidObjectId(idRaw)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  await dbConnect();
  const deleted = await FormSubmission.findByIdAndDelete(idRaw).lean();
  if (!deleted) return res.status(404).json({ error: "Not found" });

  return res.status(200).json({ ok: true });
});

