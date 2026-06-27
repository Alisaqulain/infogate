/** Max upload size (must match API `MAX_BYTES_PER_FILE`). */
export const REG_MAX_FILE_BYTES = 10 * 1024 * 1024;

/** Allowed MIME types for registration uploads (PDF + raster images). */
export const REG_ALLOWED_UPLOAD_MIMES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
]);

/** Accept attribute + extension checks (lowercase). */
export const REG_ALLOWED_EXTENSIONS = new Set(["pdf", "jpg", "jpeg", "png"]);

export const REG_FILE_ACCEPT_ATTR = ".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg";

/** Ad Dhahirah wilayats — `slug` is stable; labels come from `reg_gov_{slug}` in messages. */
export const REG_GOVERNORATE_SLUGS = [
  "1_ibri",
  "2_yanqul",
  "3_dhank",
] as const;

export type RegGovernorateSlug = (typeof REG_GOVERNORATE_SLUGS)[number];

/** English labels for emails / admin (form submits `slug`). */
export const REG_GOVERNORATE_LABEL_EN: Record<RegGovernorateSlug, string> = {
  "1_ibri": "Ibri",
  "2_yanqul": "Yanqul",
  "3_dhank": "Dhank",
};

export function isRegGovernorateSlug(v: string): v is RegGovernorateSlug {
  return (REG_GOVERNORATE_SLUGS as readonly string[]).includes(v);
}
