"use client";

import {
  adminRegistrationFileUrl,
  isImageRegistrationFile,
  type RegFileKey,
  type RegistrationFileMeta,
} from "@/lib/registration-admin";

type Props = {
  submissionId: string;
  fileKey: RegFileKey;
  label: string;
  meta: RegistrationFileMeta | null | undefined;
  fileNotStoredLabel: string;
  openPdfLabel: string;
};

export function RegistrationFilePreview({
  submissionId,
  fileKey,
  label,
  meta,
  fileNotStoredLabel,
  openPdfLabel,
}: Props) {
  if (!meta) return null;

  const url = adminRegistrationFileUrl(submissionId, fileKey);
  const isImage = isImageRegistrationFile(meta.mimeType);
  const isPdf = meta.mimeType === "application/pdf";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-0.5 truncate text-xs text-slate-600" title={meta.originalName}>
        {meta.originalName}
      </p>

      {isImage ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 block overflow-hidden rounded-lg border border-slate-100 bg-slate-50"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={meta.originalName}
            className="max-h-56 w-full object-contain"
            onError={(e) => {
              const el = e.currentTarget;
              el.style.display = "none";
              const parent = el.parentElement;
              if (parent && !parent.querySelector("[data-fallback]")) {
                const p = document.createElement("p");
                p.dataset.fallback = "1";
                p.className = "px-3 py-6 text-center text-xs text-slate-500";
                p.textContent = fileNotStoredLabel;
                parent.appendChild(p);
              }
            }}
          />
        </a>
      ) : isPdf ? (
        <div className="mt-2 space-y-2">
          <iframe
            title={meta.originalName}
            src={url}
            className="h-56 w-full rounded-lg border border-slate-100 bg-slate-50"
          />
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex text-xs font-bold text-blue-700 underline"
          >
            {openPdfLabel}
          </a>
        </div>
      ) : (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex text-xs font-bold text-blue-700 underline"
        >
          Download
        </a>
      )}
    </div>
  );
}
