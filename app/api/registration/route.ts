import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { FormSubmission } from "@/models/FormSubmission";
import { sendAdminNotification, type MailAttachment } from "@/lib/mailer";
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
  key: string,
  attachments: MailAttachment[],
  label: string
): Promise<RegistrationFileMeta | null> {
  const v = formData.get(key);
  if (!(v instanceof File) || v.size === 0) return null;

  const violation = validateRegistrationFile(v);
  if (violation === "size") {
    throw new Error(
      `${label}: file exceeds ${REG_MAX_FILE_BYTES / 1024 / 1024}MB`
    );
  }
  if (violation === "type") {
    throw new Error(`${label}: only PDF, JPG, JPEG, or PNG are allowed.`);
  }

  const buf = Buffer.from(await v.arrayBuffer());
  const originalName = v.name || `${key}.bin`;
  const ext = safeExtFromFilename(originalName);
  const storedFilename = `${label}-${Date.now()}-${randomBytes(8).toString("hex")}.${ext}`;
  attachments.push({ filename: storedFilename, content: buf });

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
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
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
    return NextResponse.json(
      { error: "Company name is required." },
      { status: 400 }
    );
  }
  if (!crNumber) {
    return NextResponse.json(
      { error: "Commercial registration number is required." },
      { status: 400 }
    );
  }
  if (!establishment) {
    return NextResponse.json(
      { error: "Date of establishment is required." },
      { status: 400 }
    );
  }
  if (!isValidEstablishmentDate(establishment)) {
    return NextResponse.json(
      { error: "Date of establishment must be a valid date not in the future." },
      { status: 400 }
    );
  }
  if (!governorateSlug || !isRegGovernorateSlug(governorateSlug)) {
    return NextResponse.json(
      { error: "Governorate / Wilayat is required." },
      { status: 400 }
    );
  }
  if (!mobile || !isValidOmanMobile(mobile)) {
    return NextResponse.json(
      { error: "Enter a valid Oman mobile number (e.g. 9XXXXXXX or +968 9XXXXXXX)." },
      { status: 400 }
    );
  }
  if (!isValidOptionalHttpUrl(website)) {
    return NextResponse.json(
      { error: "Website must be a valid http(s) URL or left empty." },
      { status: 400 }
    );
  }
  if (!isValidOptionalInstagram(instagram)) {
    return NextResponse.json(
      { error: "Instagram must be a valid Instagram URL, @handle, or left empty." },
      { status: 400 }
    );
  }
  if (!sectorChoice || !SECTOR_LABELS[sectorChoice]) {
    return NextResponse.json(
      { error: "Business sector is required." },
      { status: 400 }
    );
  }
  if (sectorChoice === "s9" && sectorOther.length < 2) {
    return NextResponse.json(
      { error: "Please specify your sector." },
      { status: 400 }
    );
  }

  const attachments: MailAttachment[] = [];
  let fileProfile: RegistrationFileMeta | null = null;
  let fileCr: RegistrationFileMeta | null = null;
  let fileRiyada: RegistrationFileMeta | null = null;

  try {
    fileProfile = await filePart(
      formData,
      "fileProfile",
      attachments,
      "company-profile"
    );
    fileCr = await filePart(
      formData,
      "fileCr",
      attachments,
      "commercial-registration"
    );
    fileRiyada = await filePart(
      formData,
      "fileRiyada",
      attachments,
      "riyada-card"
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Invalid upload.";
    return NextResponse.json({ error: msg }, { status: 400 });
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

  await dbConnect();

  const submission = await FormSubmission.create({
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
}
