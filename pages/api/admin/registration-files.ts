import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import mongoose from "mongoose";
import { requireAdmin } from "@/lib/adminApi";
import { dbConnect } from "@/lib/db";
import type { RegistrationMeta } from "@/lib/registration-admin";
import {
  isRegFileKey,
  resolveRegistrationFilePath,
  type RegFileKey,
} from "@/lib/registration-storage";
import { FormSubmission } from "@/models/FormSubmission";

function metaFile(
  meta: RegistrationMeta | null | undefined,
  fileKey: RegFileKey
) {
  return meta?.files?.[fileKey] ?? null;
}

export default requireAdmin(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const submissionId = Array.isArray(req.query.submissionId)
    ? req.query.submissionId[0]
    : req.query.submissionId;
  const fileKeyRaw = Array.isArray(req.query.file)
    ? req.query.file[0]
    : req.query.file;

  if (
    !submissionId ||
    typeof submissionId !== "string" ||
    !mongoose.isValidObjectId(submissionId)
  ) {
    return res.status(400).json({ error: "Invalid submission id" });
  }
  if (!fileKeyRaw || typeof fileKeyRaw !== "string" || !isRegFileKey(fileKeyRaw)) {
    return res.status(400).json({ error: "Invalid file key" });
  }

  await dbConnect();
  const doc = await FormSubmission.findOne({
    _id: submissionId,
    type: "registration",
  }).lean();

  if (!doc) return res.status(404).json({ error: "Not found" });

  const meta = (doc.meta as RegistrationMeta | undefined) ?? null;
  const fileMeta = metaFile(meta, fileKeyRaw);
  if (!fileMeta) return res.status(404).json({ error: "File not found" });

  const diskPath = resolveRegistrationFilePath(submissionId, fileKeyRaw);
  if (!diskPath || !fs.existsSync(diskPath)) {
    return res.status(404).json({ error: "File not on server" });
  }

  const buf = await fs.promises.readFile(diskPath);
  const mime = fileMeta.mimeType || "application/octet-stream";
  const inline = mime.startsWith("image/") || mime === "application/pdf";

  res.setHeader("Content-Type", mime);
  res.setHeader(
    "Content-Disposition",
    `${inline ? "inline" : "attachment"}; filename="${encodeURIComponent(fileMeta.originalName)}"`
  );
  res.setHeader("Cache-Control", "private, max-age=3600");
  return res.status(200).send(buf);
});
