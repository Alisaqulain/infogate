import fs from "fs";
import path from "path";
import multer from "multer";

type UploadBucket = "services" | "blogs";

const rootUploadDir = path.join(process.cwd(), "public", "uploads");

function ensureDir(bucket: UploadBucket) {
  const dir = path.join(rootUploadDir, bucket);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

function sanitizeBaseName(name: string) {
  return name.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 80) || "file";
}

function makeStorage(bucket: UploadBucket) {
  return multer.diskStorage({
    destination(_req, _file, cb) {
      cb(null, ensureDir(bucket));
    },
    filename(_req, file, cb) {
      const ext = path.extname(file.originalname || "").toLowerCase() || ".bin";
      const base = sanitizeBaseName(path.basename(file.originalname || "upload", ext));
      cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}-${base}${ext}`);
    },
  });
}

const imageMimeTypes = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function imageFileFilter(_req: unknown, file: { mimetype: string }, cb: multer.FileFilterCallback) {
  if (!imageMimeTypes.has(file.mimetype)) {
    cb(new Error("Only image files are allowed"));
    return;
  }
  cb(null, true);
}

export function createImageUpload(bucket: UploadBucket) {
  return multer({
    storage: makeStorage(bucket),
    fileFilter: imageFileFilter,
    limits: { fileSize: 8 * 1024 * 1024 },
  });
}

export function toPublicUploadPath(bucket: UploadBucket, filename: string) {
  return `/uploads/${bucket}/${filename}`;
}
