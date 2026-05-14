import {
  REG_ALLOWED_EXTENSIONS,
  REG_ALLOWED_UPLOAD_MIMES,
  REG_MAX_FILE_BYTES,
} from "@/lib/registration-constants";

const MOBILE_OMAN = /^(?:\+968|968|00968)?[79]\d{7}$/;

function stripMobile(s: string): string {
  return s.replace(/\s+/g, "");
}

export function isValidOmanMobile(raw: string): boolean {
  const s = stripMobile(raw.trim());
  if (!s) return false;
  return MOBILE_OMAN.test(s);
}

/** Empty is valid (optional field). */
export function isValidOptionalHttpUrl(raw: string): boolean {
  const t = raw.trim();
  if (!t) return true;
  try {
    const u = new URL(t.includes("://") ? t : `https://${t}`);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

/** Instagram field: empty, full URL, or @handle / path fragment. */
export function isValidOptionalInstagram(raw: string): boolean {
  const t = raw.trim();
  if (!t) return true;
  if (t.startsWith("@")) return t.length >= 2 && t.length <= 64;
  if (isValidOptionalHttpUrl(t)) {
    try {
      const u = new URL(t.includes("://") ? t : `https://${t}`);
      return /instagram\.com$/i.test(u.hostname.replace(/^www\./, ""));
    } catch {
      return false;
    }
  }
  return false;
}

export function isValidEstablishmentDate(isoDate: string, now = new Date()): boolean {
  const t = isoDate.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(t)) return false;
  const parts = t.split("-").map(Number);
  const y = parts[0];
  const m = parts[1];
  const d = parts[2];
  if (y === undefined || m === undefined || d === undefined) return false;
  const picked = new Date(y, m - 1, d);
  if (Number.isNaN(picked.getTime())) return false;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const min = new Date(1900, 0, 1);
  return picked >= min && picked <= today;
}

export type FilePolicyViolation = "type" | "size" | null;

export function validateRegistrationFile(file: File): FilePolicyViolation {
  if (file.size > REG_MAX_FILE_BYTES) return "size";
  const ext = (file.name.split(".").pop() ?? "").toLowerCase();
  if (!REG_ALLOWED_EXTENSIONS.has(ext)) return "type";
  const mime = (file.type || "").trim().toLowerCase();
  if (!mime) return null;
  if (!REG_ALLOWED_UPLOAD_MIMES.has(mime)) return "type";
  if (ext === "pdf" && mime !== "application/pdf") return "type";
  if ((ext === "jpg" || ext === "jpeg") && mime !== "image/jpeg") return "type";
  if (ext === "png" && mime !== "image/png") return "type";
  return null;
}
