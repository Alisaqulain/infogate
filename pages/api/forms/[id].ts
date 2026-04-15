import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { dbConnect } from "@/lib/db";
import { FormSubmission } from "@/models/FormSubmission";
import { getAdminFromRequest } from "@/lib/adminAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") return res.status(405).json({ error: "Method not allowed" });
  if (!getAdminFromRequest(req)) return res.status(401).json({ error: "Unauthorized" });

  const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
  if (!id || !mongoose.isValidObjectId(id)) return res.status(400).json({ error: "Invalid id" });

  await dbConnect();
  const deleted = await FormSubmission.findByIdAndDelete(id).lean();
  if (!deleted) return res.status(404).json({ error: "Not found" });

  return res.status(200).json({ ok: true });
}
