import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { FormSubmission } from "@/models/FormSubmission";
import { sendAdminNotification, type MailAttachment } from "@/lib/mailer";

export const runtime = "nodejs";

const MAX_BYTES_PER_FILE = 10 * 1024 * 1024;

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

function str(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v.trim() : "";
}

async function filePart(
  formData: FormData,
  key: string,
  attachments: MailAttachment[],
  label: string
) {
  const v = formData.get(key);
  if (!(v instanceof File) || v.size === 0) return null;
  if (v.size > MAX_BYTES_PER_FILE) {
    throw new Error(`${label}: file exceeds ${MAX_BYTES_PER_FILE / 1024 / 1024}MB`);
  }
  const buf = Buffer.from(await v.arrayBuffer());
  const name = v.name || `${key}.bin`;
  attachments.push({ filename: `${label}-${name}`, content: buf });
  return name;
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
  const governorate = str(formData, "governorate");
  const mobile = str(formData, "mobile");
  const website = str(formData, "website");
  const instagram = str(formData, "instagram");
  const sectorChoice = str(formData, "sectorChoice");
  const sectorOther = str(formData, "sectorOther");

  if (companyName.length < 2) {
    return NextResponse.json({ error: "Company name is required." }, { status: 400 });
  }
  if (!crNumber) {
    return NextResponse.json({ error: "Commercial registration number is required." }, { status: 400 });
  }
  if (!establishment) {
    return NextResponse.json({ error: "Date of establishment is required." }, { status: 400 });
  }
  if (!governorate) {
    return NextResponse.json({ error: "Governorate / Wilayat is required." }, { status: 400 });
  }
  if (!mobile) {
    return NextResponse.json({ error: "Mobile number is required." }, { status: 400 });
  }
  if (!sectorChoice || !SECTOR_LABELS[sectorChoice]) {
    return NextResponse.json({ error: "Business sector is required." }, { status: 400 });
  }
  if (sectorChoice === "s9" && sectorOther.length < 2) {
    return NextResponse.json({ error: "Please specify your sector." }, { status: 400 });
  }

  const attachments: MailAttachment[] = [];
  let fileProfile: string | null = null;
  let fileCr: string | null = null;
  let fileRiyada: string | null = null;

  try {
    fileProfile = await filePart(formData, "fileProfile", attachments, "company-profile");
    fileCr = await filePart(formData, "fileCr", attachments, "commercial-registration");
    fileRiyada = await filePart(formData, "fileRiyada", attachments, "riyada-card");
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Invalid upload.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const sectorLabel = SECTOR_LABELS[sectorChoice] ?? sectorChoice;
  const meta = {
    tradeName: tradeName || undefined,
    crNumber,
    establishment,
    governorate,
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

  const messageBody = [
    `Program registration`,
    `Company: ${companyName}`,
    tradeName ? `Trade name: ${tradeName}` : null,
    `CR: ${crNumber}`,
    `Established: ${establishment}`,
    `Governorate / Wilayat: ${governorate}`,
    `Mobile: ${mobile}`,
    website ? `Website: ${website}` : null,
    instagram ? `Instagram: ${instagram}` : null,
    `Sector: ${sectorLabel}`,
    sectorChoice === "s9" ? `Other detail: ${sectorOther}` : null,
    "",
    "Attached files (filenames):",
    fileProfile ? `• Company profile: ${fileProfile}` : "• Company profile: (none)",
    fileCr ? `• Commercial registration copy: ${fileCr}` : "• Commercial registration copy: (none)",
    fileRiyada ? `• Riyada card: ${fileRiyada}` : "• Riyada card: (none)",
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
