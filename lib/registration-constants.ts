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

/** Oman governorates — `slug` is stable; labels come from `reg_gov_{slug}` in messages. */
export const REG_GOVERNORATE_SLUGS = [
  "muscat",
  "dhofar",
  "musandam",
  "al_buraimi",
  "ad_dakhiliyah",
  "north_al_batinah",
  "south_al_batinah",
  "north_ash_sharqiyah",
  "south_ash_sharqiyah",
  "ad_dhahirah",
  "al_wusta",
] as const;

export type RegGovernorateSlug = (typeof REG_GOVERNORATE_SLUGS)[number];

/** English labels for emails / admin (form submits `slug`). */
export const REG_GOVERNORATE_LABEL_EN: Record<RegGovernorateSlug, string> = {
  muscat: "Muscat",
  dhofar: "Dhofar",
  musandam: "Musandam",
  al_buraimi: "Al Buraimi",
  ad_dakhiliyah: "Ad Dakhiliyah",
  north_al_batinah: "North Al Batinah",
  south_al_batinah: "South Al Batinah",
  north_ash_sharqiyah: "North Ash Sharqiyah",
  south_ash_sharqiyah: "South Ash Sharqiyah",
  ad_dhahirah: "Ad Dhahirah",
  al_wusta: "Al Wusta",
};

export function isRegGovernorateSlug(v: string): v is RegGovernorateSlug {
  return (REG_GOVERNORATE_SLUGS as readonly string[]).includes(v);
}
