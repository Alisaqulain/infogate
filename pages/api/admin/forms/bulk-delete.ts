import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import { z } from "zod";
import { requireAdmin } from "@/lib/adminApi";
import { dbConnect } from "@/lib/db";
import { deleteRegistrationFiles } from "@/lib/registration-storage";
import { FormSubmission } from "@/models/FormSubmission";

const BodySchema = z.object({
  ids: z.array(z.string()).min(1).max(200),
});

export default requireAdmin(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const parsed = BodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  const ids = parsed.data.ids.filter(
    (id) => typeof id === "string" && mongoose.isValidObjectId(id)
  );
  if (ids.length === 0) {
    return res.status(400).json({ error: "No valid ids" });
  }

  await dbConnect();

  const result = await FormSubmission.deleteMany({
    _id: { $in: ids },
    type: "registration",
  });

  for (const id of ids) {
    deleteRegistrationFiles(id);
  }

  return res.status(200).json({
    ok: true,
    deletedCount: result.deletedCount ?? 0,
  });
});
