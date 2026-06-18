import { randomBytes } from "crypto";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { saveRegistrationFile, type RegFileKey } from "@/lib/registration-storage";
import { FormSubmission } from "@/models/FormSubmission";
import { sendAdminNotification, type MailAttachment } from "@/lib/mailer";
import { apiFieldError, apiGenericError } from "@/lib/form-api-errors";
import {
  isRegGovernorateSlug,
  REG_GOVERNORATE_LABEL_EN,
  REG_MAX_FILE_BYTES,
  type RegGovernorateSlug,
} from "@/lib/registration-constants";
import {
  isValidEstablishmentDate,
  isValidOmanMobile,
  isValidOptionalHttpUrl,
  isValidOptionalInstagram,
  validateRegistrationFile,
} from "@/lib/registration-validation";

export const runtime = "nodejs";

const SECTOR_LABELS: Record<string, string> = {
  s1: "Manufacturing & Light Industry",
  s2: "Logistics & Supply Chain",
  s3: "ICT & Digital Services",
  s4: "Construction & Contracting",
  s5: "Energy, Sustainability & Local Content Services",
  s6: "Professional & Business Services",
  s7: "Mining",
  s8: "Tourism",
  s9: "Other (please specify)",
};

export type RegistrationFileMeta = {
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  uploadedAt: string;
  /** Unique name used for the email attachment / logical storage key */
  storedFilename: string;
};

function str(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v.trim() : "";
}

function safeExtFromFilename(name: string): string {
  const ext = (name.split(".").pop() ?? "").toLowerCase();
  if (ext === "jpeg" || ext === "jpg") return "jpg";
  if (ext === "png") return "png";
  if (ext === "pdf") return "pdf";
  return "bin";
}

async function filePart(
  formData: FormData,
  formKey: string,
  fieldKey: "fileProfile" | "fileCr" | "fileRiyada",
  fileKey: RegFileKey,
  submissionId: string,
  attachments: MailAttachment[],
  label: string
): Promise<RegistrationFileMeta | null> {
  const v = formData.get(formKey);
  if (!(v instanceof File) || v.size === 0) return null;

  const violation = validateRegistrationFile(v);
  if (violation === "size") {
    throw Object.assign(new Error("size"), { field: fieldKey, code: "file_size" });
  }
  if (violation === "type") {
    throw Object.assign(new Error("type"), { field: fieldKey, code: "file_type" });
  }

  const buf = Buffer.from(await v.arrayBuffer());
  const originalName = v.name || `${formKey}.bin`;
  const ext = safeExtFromFilename(originalName);
  const emailFilename = `${label}-${Date.now()}-${randomBytes(8).toString("hex")}.${ext}`;
  attachments.push({ filename: emailFilename, content: buf });

  const storedFilename = await saveRegistrationFile(
    submissionId,
    fileKey,
    buf,
    ext
  );

  return {
    originalName,
    mimeType: (v.type || "application/octet-stream").toLowerCase(),
    sizeBytes: v.size,
    uploadedAt: new Date().toISOString(),
    storedFilename,
  };
}

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return apiGenericError("Invalid form data.", 400);
  }

  const companyName = str(formData, "companyName");
  const tradeName = str(formData, "tradeName");
  const crNumber = str(formData, "crNumber");
  const establishment = str(formData, "establishment");
  const governorateSlug = str(formData, "governorate");
  const mobile = str(formData, "mobile");
  const website = str(formData, "website");
  const instagram = str(formData, "instagram");
  const sectorChoice = str(formData, "sectorChoice");
  const sectorOther = str(formData, "sectorOther");

  if (companyName.length < 2) {
    return apiFieldError("companyName", "company_min");
  }
  if (!crNumber) {
    return apiFieldError("crNumber", "cr_required");
  }
  if (!establishment) {
    return apiFieldError("establishment", "establishment_required");
  }
  if (!isValidEstablishmentDate(establishment)) {
    return apiFieldError("establishment", "establishment_invalid");
  }
  if (!governorateSlug || !isRegGovernorateSlug(governorateSlug)) {
    return apiFieldError("governorate", "governorate_required");
  }
  if (!mobile || !isValidOmanMobile(mobile)) {
    return apiFieldError("mobile", "mobile_invalid");
  }
  if (!isValidOptionalHttpUrl(website)) {
    return apiFieldError("website", "website_invalid");
  }
  if (!isValidOptionalInstagram(instagram)) {
    return apiFieldError("instagram", "instagram_invalid");
  }
  if (!sectorChoice || !SECTOR_LABELS[sectorChoice]) {
    return apiFieldError("sector", "sector_required");
  }
  if (sectorChoice === "s9" && sectorOther.length < 2) {
    return apiFieldError("sectorOther", "sector_other_required");
  }

  const submissionId = new mongoose.Types.ObjectId();
  const submissionIdStr = submissionId.toString();

  const attachments: MailAttachment[] = [];
  let fileProfile: RegistrationFileMeta | null = null;
  let fileCr: RegistrationFileMeta | null = null;
  let fileRiyada: RegistrationFileMeta | null = null;

  try {
    fileProfile = await filePart(
      formData,
      "fileProfile",
      "fileProfile",
      "profile",
      submissionIdStr,
      attachments,
      "company-profile"
    );
    fileCr = await filePart(
      formData,
      "fileCr",
      "fileCr",
      "commercialReg",
      submissionIdStr,
      attachments,
      "commercial-registration"
    );
    fileRiyada = await filePart(
      formData,
      "fileRiyada",
      "fileRiyada",
      "riyada",
      submissionIdStr,
      attachments,
      "riyada-card"
    );
  } catch (e) {
    const field =
      e && typeof e === "object" && "field" in e
        ? (e as { field: "fileProfile" | "fileCr" | "fileRiyada" }).field
        : undefined;
    const code =
      e && typeof e === "object" && "code" in e
        ? String((e as { code: string }).code)
        : "file_invalid";
    if (field) {
      return apiFieldError(field, code);
    }
    return apiGenericError("Invalid upload.", 400);
  }

  const sectorLabel = SECTOR_LABELS[sectorChoice] ?? sectorChoice;
  const govLabel =
    REG_GOVERNORATE_LABEL_EN[governorateSlug as RegGovernorateSlug] ??
    governorateSlug;

  const meta = {
    tradeName: tradeName || undefined,
    crNumber,
    establishment,
    governorate: governorateSlug,
    governorateLabel: govLabel,
    website: website || undefined,
    instagram: instagram || undefined,
    sector: sectorChoice,
    sectorLabel,
    sectorOther: sectorChoice === "s9" ? sectorOther : undefined,
    files: {
      profile: fileProfile,
      commercialReg: fileCr,
      riyada: fileRiyada,
    },
  };

  const fileLine = (m: RegistrationFileMeta | null, title: string) => {
    if (!m) return `• ${title}: (none)`;
    return `• ${title}: ${m.originalName} → stored as ${m.storedFilename} (${m.mimeType}, ${m.sizeBytes} bytes, ${m.uploadedAt})`;
  };

  const messageBody = [
    `Program registration`,
    `Company: ${companyName}`,
    tradeName ? `Trade name: ${tradeName}` : null,
    `CR: ${crNumber}`,
    `Established: ${establishment}`,
    `Governorate / Wilayat: ${govLabel} (${governorateSlug})`,
    `Mobile: ${mobile}`,
    website ? `Website: ${website}` : null,
    instagram ? `Instagram: ${instagram}` : null,
    `Sector: ${sectorLabel}`,
    sectorChoice === "s9" ? `Other detail: ${sectorOther}` : null,
    "",
    "Attached files:",
    fileLine(fileProfile, "Company profile"),
    fileLine(fileCr, "Commercial registration copy"),
    fileLine(fileRiyada, "Riyada card"),
  ]
    .filter(Boolean)
    .join("\n");

  try {
    await dbConnect();

    const submission = await FormSubmission.create({
      _id: submissionId,
      type: "registration",
      name: companyName,
      email: undefined,
      phone: mobile,
      message: messageBody,
      meta,
    });

    let emailSent = false;
    try {
      const res = await sendAdminNotification({
        subject: `Program registration — ${companyName}`,
        text: [
          messageBody,
          "",
          `Submission ID: ${submission._id.toString()}`,
          `Locale: ${str(formData, "locale") || "unknown"}`,
        ].join("\n"),
        attachments: attachments.length ? attachments : undefined,
      });
      emailSent = res.ok;
    } catch {
      emailSent = false;
    }

    return NextResponse.json({ ok: true, id: submission._id.toString(), emailSent });
  } catch {
    return apiGenericError("Unable to save your registration. Please try again later.");
  }
}
