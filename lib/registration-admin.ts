export type RegistrationFileMeta = {
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  uploadedAt: string;
  storedFilename: string;
};

export const REG_FILE_KEYS = ["profile", "commercialReg", "riyada"] as const;
export type RegFileKey = (typeof REG_FILE_KEYS)[number];

export function isImageRegistrationFile(mime: string | undefined): boolean {
  if (!mime) return false;
  return mime === "image/jpeg" || mime === "image/jpg" || mime === "image/png";
}

export function adminRegistrationFileUrl(
  submissionId: string,
  fileKey: RegFileKey
): string {
  return `/api/admin/registration-files?submissionId=${encodeURIComponent(submissionId)}&file=${fileKey}`;
}

export type RegistrationMeta = {
  tradeName?: string;
  crNumber?: string;
  establishment?: string;
  governorate?: string;
  governorateLabel?: string;
  website?: string;
  instagram?: string;
  sector?: string;
  sectorLabel?: string;
  sectorOther?: string;
  files?: {
    profile?: RegistrationFileMeta | null;
    commercialReg?: RegistrationFileMeta | null;
    riyada?: RegistrationFileMeta | null;
  };
};

export type RegistrationSubmission = {
  id: string;
  name: string;
  phone: string | null;
  message: string | null;
  meta: RegistrationMeta | null;
  createdAt: string;
};

export const REG_EXPORT_COLUMNS = [
  "Submitted",
  "Company",
  "Trade name",
  "CR number",
  "Established",
  "Governorate",
  "Mobile",
  "Website",
  "Instagram",
  "Sector",
  "Sector (other)",
  "Company profile file",
  "Commercial reg file",
  "Riyada card file",
] as const;

export type RegExportRow = Record<(typeof REG_EXPORT_COLUMNS)[number], string>;

function fileLabel(f: RegistrationFileMeta | null | undefined): string {
  if (!f) return "—";
  const kb = (f.sizeBytes / 1024).toFixed(1);
  return `${f.originalName} (${kb} KB)`;
}

export function formatSubmittedAt(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export function registrationToExportRow(sub: RegistrationSubmission): RegExportRow {
  const m = sub.meta;
  return {
    Submitted: formatSubmittedAt(sub.createdAt),
    Company: sub.name,
    "Trade name": m?.tradeName ?? "—",
    "CR number": m?.crNumber ?? "—",
    Established: m?.establishment ?? "—",
    Governorate: m?.governorateLabel ?? m?.governorate ?? "—",
    Mobile: sub.phone ?? "—",
    Website: m?.website ?? "—",
    Instagram: m?.instagram ?? "—",
    Sector: m?.sectorLabel ?? m?.sector ?? "—",
    "Sector (other)": m?.sectorOther ?? "—",
    "Company profile file": fileLabel(m?.files?.profile),
    "Commercial reg file": fileLabel(m?.files?.commercialReg),
    "Riyada card file": fileLabel(m?.files?.riyada),
  };
}

export function parseRegistrationSubmission(raw: {
  id: string;
  name: string;
  phone?: string | null;
  message?: string | null;
  meta?: unknown;
  createdAt: string | Date;
}): RegistrationSubmission {
  return {
    id: raw.id,
    name: raw.name,
    phone: raw.phone ?? null,
    message: raw.message ?? null,
    meta: (raw.meta as RegistrationMeta | null) ?? null,
    createdAt:
      typeof raw.createdAt === "string"
        ? raw.createdAt
        : new Date(raw.createdAt).toISOString(),
  };
}
