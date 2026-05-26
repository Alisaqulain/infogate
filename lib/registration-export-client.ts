import type {
  RegExportRow,
  RegFileKey,
  RegistrationSubmission,
} from "@/lib/registration-admin";
import {
  REG_EXPORT_COLUMNS,
  REG_FILE_KEYS,
  adminRegistrationFileUrl,
  isImageRegistrationFile,
  registrationToExportRow,
} from "@/lib/registration-admin";

function stamp(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`;
}

function rowsFromSubs(subs: RegistrationSubmission[]): RegExportRow[] {
  return subs.map(registrationToExportRow);
}

function safeFilenamePart(name: string): string {
  return name.replace(/[^\w\-]+/g, "_").slice(0, 40) || "registration";
}

async function fetchAdminFileDataUrl(
  submissionId: string,
  fileKey: RegFileKey
): Promise<string | null> {
  const res = await fetch(adminRegistrationFileUrl(submissionId, fileKey), {
    credentials: "include",
  });
  if (!res.ok) return null;
  const blob = await res.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : null);
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(blob);
  });
}

function jspdfImageFormat(mime: string): "JPEG" | "PNG" {
  return mime.includes("png") ? "PNG" : "JPEG";
}

const FILE_LABELS: Record<RegFileKey, string> = {
  profile: "Company profile",
  commercialReg: "Commercial registration",
  riyada: "Riyada card",
};

async function appendRegistrationFilesToPdf(
  doc: import("jspdf").jsPDF,
  sub: RegistrationSubmission,
  startY: number
) {
  const pageH = doc.internal.pageSize.getHeight();
  const marginX = 40;
  const maxW = doc.internal.pageSize.getWidth() - marginX * 2;
  let y = startY + 16;

  doc.setFontSize(11);
  doc.setTextColor(15, 40, 71);
  doc.text("Uploaded documents", marginX, y);
  y += 18;
  doc.setTextColor(0);

  const entries = REG_FILE_KEYS.map((key) => ({
    key,
    label: FILE_LABELS[key],
    meta: sub.meta?.files?.[key] ?? null,
  })).filter((e) => e.meta);

  for (const { key, label, meta } of entries) {
    if (!meta) continue;

    if (y > pageH - 120) {
      doc.addPage();
      y = 48;
    }

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(label, marginX, y);
    y += 14;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(meta.originalName, marginX, y);
    y += 12;

    if (isImageRegistrationFile(meta.mimeType)) {
      const dataUrl = await fetchAdminFileDataUrl(sub.id, key);
      if (dataUrl) {
        try {
          const props = doc.getImageProperties(dataUrl);
          const ratio = props.height / props.width;
          const imgW = Math.min(maxW, 420);
          const imgH = imgW * ratio;

          if (y + imgH > pageH - 40) {
            doc.addPage();
            y = 48;
          }

          doc.addImage(
            dataUrl,
            jspdfImageFormat(meta.mimeType),
            marginX,
            y,
            imgW,
            imgH
          );
          y += imgH + 20;
        } catch {
          doc.text("(Image could not be embedded)", marginX, y);
          y += 16;
        }
      } else {
        doc.text("(File not available on server)", marginX, y);
        y += 16;
      }
    } else if (meta.mimeType === "application/pdf") {
      doc.text("PDF attachment — open in admin panel to view.", marginX, y);
      y += 20;
    }

    y += 8;
  }
}

function extFromOriginalName(name: string): string {
  const ext = (name.split(".").pop() ?? "bin").toLowerCase();
  if (ext === "jpeg") return "jpg";
  if (ext === "pdf" || ext === "jpg" || ext === "png") return ext;
  return "bin";
}

const ZIP_FILE_ENTRY: Record<RegFileKey, string> = {
  profile: "1-company-profile",
  commercialReg: "2-commercial-registration",
  riyada: "3-riyada-card",
};

function submissionFolderName(sub: RegistrationSubmission, index: number): string {
  return `${String(index + 1).padStart(3, "0")}-${safeFilenamePart(sub.name)}-${sub.id.slice(-6)}`;
}

async function buildRegistrationsExcelBuffer(subs: RegistrationSubmission[]) {
  const XLSX = await import("xlsx");
  const rows = rowsFromSubs(subs);
  const sheet = XLSX.utils.json_to_sheet(rows, { header: [...REG_EXPORT_COLUMNS] });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, sheet, "Registrations");
  return XLSX.write(wb, { bookType: "xlsx", type: "array" }) as ArrayBuffer;
}

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function downloadRegistrationsExcel(
  subs: RegistrationSubmission[],
  filenamePrefix = "osus-registrations"
) {
  const buf = await buildRegistrationsExcelBuffer(subs);
  triggerBlobDownload(
    new Blob([buf], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }),
    `${filenamePrefix}-${stamp()}.xlsx`
  );
}

/** ZIP: Excel summary + each submission’s 3 uploads (profile, CR, Riyada) when stored on server. */
export async function downloadRegistrationsZip(
  subs: RegistrationSubmission[],
  filenamePrefix = "osus-registrations"
) {
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();

  zip.file("registrations.xlsx", await buildRegistrationsExcelBuffer(subs));

  const uploads = zip.folder("uploads");
  if (!uploads) throw new Error("Could not create ZIP folder");

  for (let i = 0; i < subs.length; i++) {
    const sub = subs[i];
    const folder = uploads.folder(submissionFolderName(sub, i));
    if (!folder) continue;

    for (const fileKey of REG_FILE_KEYS) {
      const meta = sub.meta?.files?.[fileKey];
      if (!meta) continue;

      const res = await fetch(adminRegistrationFileUrl(sub.id, fileKey), {
        credentials: "include",
      });
      if (!res.ok) continue;

      const buf = await res.arrayBuffer();
      const ext = extFromOriginalName(meta.originalName);
      folder.file(`${ZIP_FILE_ENTRY[fileKey]}.${ext}`, buf);
    }
  }

  const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
  triggerBlobDownload(blob, `${filenamePrefix}-${stamp()}.zip`);
}

export async function downloadRegistrationsPdf(
  subs: RegistrationSubmission[],
  filenamePrefix = "osus-registrations"
) {
  const { jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;
  const rows = rowsFromSubs(subs);
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });

  doc.setFontSize(14);
  doc.text("Osus Program — Registration submission", 40, 36);
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text(`Generated ${new Date().toLocaleString()} · ${subs.length} record(s)`, 40, 52);
  doc.setTextColor(0);

  autoTable(doc, {
    startY: 64,
    head: [REG_EXPORT_COLUMNS as unknown as string[]],
    body: rows.map((r) => REG_EXPORT_COLUMNS.map((c) => r[c])),
    styles: { fontSize: 7, cellPadding: 3, overflow: "linebreak" },
    headStyles: { fillColor: [15, 40, 71], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [245, 248, 252] },
    margin: { left: 24, right: 24 },
  });

  doc.save(`${filenamePrefix}-${stamp()}.pdf`);
}

export async function downloadSingleRegistrationPdf(sub: RegistrationSubmission) {
  const { jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;
  const row = registrationToExportRow(sub);
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  doc.setFontSize(16);
  doc.text("Osus Program — Registration", 40, 44);
  doc.setFontSize(10);
  doc.setTextColor(90);
  doc.text(row.Company, 40, 62);
  doc.text(`Submitted ${row.Submitted}`, 40, 76);
  doc.setTextColor(0);

  const pairs = REG_EXPORT_COLUMNS.map((k) => [k, row[k]]);
  autoTable(doc, {
    startY: 92,
    head: [["Field", "Value"]],
    body: pairs,
    styles: { fontSize: 9, cellPadding: 5 },
    headStyles: { fillColor: [15, 40, 71], textColor: 255 },
    columnStyles: { 0: { cellWidth: 160, fontStyle: "bold" }, 1: { cellWidth: 360 } },
    margin: { left: 40, right: 40 },
  });

  const finalY =
    (doc as import("jspdf").jsPDF & { lastAutoTable?: { finalY: number } })
      .lastAutoTable?.finalY ?? 92;

  await appendRegistrationFilesToPdf(doc, sub, finalY);

  const safeName = safeFilenamePart(sub.name);
  doc.save(`osus-${safeName}-${sub.id.slice(-6)}.pdf`);
}

export async function downloadSingleRegistrationExcel(sub: RegistrationSubmission) {
  const safeName = safeFilenamePart(sub.name);
  await downloadRegistrationsExcel([sub], `osus-${safeName}`);
}
