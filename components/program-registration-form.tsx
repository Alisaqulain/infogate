"use client";

import { useTranslations, useLocale } from "next-intl";
import { Calendar } from "lucide-react";
import {
  useCallback,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { RegistrationSuccessDialog } from "@/components/registration-success-dialog";
import { cn } from "@/lib/utils";

const PRIMARY = "#003366";
const HEADER_BG = "#f0f7ff";
const BORDER = "#cccccc";

const SECTOR_IDS = [
  "s1",
  "s2",
  "s3",
  "s4",
  "s5",
  "s6",
  "s7",
  "s8",
  "s9",
] as const;

const REG_SECTOR_KEYS = [
  "reg_sector_1",
  "reg_sector_2",
  "reg_sector_3",
  "reg_sector_4",
  "reg_sector_5",
  "reg_sector_6",
  "reg_sector_7",
  "reg_sector_8",
  "reg_sector_9",
] as const;

type SectorId = (typeof SECTOR_IDS)[number];

function FileUploadRow({
  id,
  label,
  hint,
  accept,
  inputName,
  fileKey,
  fileName,
  onChoose,
}: {
  id: string;
  label: string;
  hint: string;
  accept: string;
  /** Distinct `name` for FormData (avoids clash with text fields like CR number). */
  inputName: string;
  fileKey: "profile" | "cr" | "riyada";
  fileName: string | null;
  onChoose: (
    key: "profile" | "cr" | "riyada",
    e: ChangeEvent<HTMLInputElement>
  ) => void;
}) {
  const t = useTranslations();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-sm font-semibold text-slate-700"
        style={{ color: "#334155" }}
      >
        {label}
      </label>
      <div
        className="flex min-h-[46px] flex-wrap items-center gap-3 rounded-lg border bg-white px-3 py-2"
        style={{ borderColor: BORDER }}
      >
        <button
          type="button"
          className="shrink-0 rounded-md border px-3 py-1.5 text-sm font-medium transition hover:bg-slate-50"
          style={{ borderColor: BORDER, color: PRIMARY }}
          onClick={() => inputRef.current?.click()}
        >
          {t("reg_choose_file")}
        </button>
        <span className="min-w-0 flex-1 text-sm text-slate-500">
          {fileName ?? t("reg_no_file")}
        </span>
        <input
          ref={inputRef}
          id={id}
          name={inputName}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(e) => onChoose(fileKey, e)}
        />
      </div>
      <p className="text-xs leading-relaxed text-slate-500">{hint}</p>
    </div>
  );
}

export function ProgramRegistrationForm() {
  const t = useTranslations();
  const locale = useLocale();
  const formId = useId();

  const [sector, setSector] = useState<SectorId | "">("");
  const [otherDetail, setOtherDetail] = useState("");
  const [files, setFiles] = useState<{
    profile: string | null;
    cr: string | null;
    riyada: string | null;
  }>({ profile: null, cr: null, riyada: null });

  const formRef = useRef<HTMLFormElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const onFileChange = useCallback(
    (key: "profile" | "cr" | "riyada", e: ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      setFiles((prev) => ({
        ...prev,
        [key]: f?.name ?? null,
      }));
    },
    []
  );

  const resetFiles = () => {
    setFiles({ profile: null, cr: null, riyada: null });
  };

  const handleClear = () => {
    formRef.current?.reset();
    setSector("");
    setOtherDetail("");
    resetFiles();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!sector) {
      window.alert(t("reg_sector_prompt"));
      return;
    }
    if (sector === "s9" && !otherDetail.trim()) {
      window.alert(t("reg_other_detail_label"));
      return;
    }
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData(form);
      fd.set("locale", locale);
      const res = await fetch("/api/registration", {
        method: "POST",
        body: fd,
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        window.alert(data.error ?? "Submission failed.");
        return;
      }
      handleClear();
      setSuccessOpen(true);
    } catch {
      window.alert("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const arabicFont = locale === "ar";

  return (
    <>
      <RegistrationSuccessDialog
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        title={t("reg_success_heading")}
        message={t("reg_submit_success")}
        confirmLabel={t("reg_modal_ok")}
        dir={locale === "ar" ? "rtl" : "ltr"}
      />
    <div
      className={cn(
        /* Match SiteHeader inner container: logo ↔ nav/CTA edges */
        "mx-auto w-full max-w-6xl px-3 pb-16 pt-8 sm:px-6 md:pb-24 md:pt-10",
        arabicFont && "font-arabic"
      )}
    >
      {/* Main card */}
      <div
        className="overflow-hidden rounded-2xl border bg-white shadow-xl shadow-black/10"
        style={{ borderColor: "#e2e8f0" }}
      >
        <div
          className="border-b px-6 py-6 md:px-10 md:py-8"
          style={{ backgroundColor: HEADER_BG, borderColor: BORDER }}
        >
          <h2
            className="text-xl font-bold md:text-2xl"
            style={{ color: PRIMARY }}
          >
            {t("reg_title")}
          </h2>
          <p className="mt-2 text-sm font-medium md:text-base text-slate-500">
            {t("reg_subtitle")}
          </p>
        </div>

        <form
          ref={formRef}
          id={formId}
          className="space-y-8 px-6 py-8 md:space-y-10 md:px-10 md:py-10"
          onSubmit={handleSubmit}
          noValidate={false}
        >
          {/* Section 1 */}
          <section
            className="rounded-xl border p-6 md:p-8"
            style={{ borderColor: BORDER }}
          >
            <h3
              className="mb-6 text-base font-bold md:text-lg"
              style={{ color: PRIMARY }}
            >
              {t("reg_section1_title")}
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">
                  {t("reg_company_name")}{" "}
                  <span className="text-red-600">{t("reg_required_suffix")}</span>
                </label>
                <input
                  name="companyName"
                  required
                  autoComplete="organization"
                  className="w-full rounded-lg border border-[#cccccc] bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">
                  {t("reg_trade_name")}
                </label>
                <input
                  name="tradeName"
                  autoComplete="off"
                  className="w-full rounded-lg border border-[#cccccc] bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">
                  {t("reg_cr")}{" "}
                  <span className="text-red-600">{t("reg_required_suffix")}</span>
                </label>
                <input
                  name="crNumber"
                  required
                  className="w-full rounded-lg border border-[#cccccc] bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">
                  {t("reg_establishment")}{" "}
                  <span className="text-red-600">{t("reg_required_suffix")}</span>
                </label>
                <div className="relative">
                  <input
                    name="establishment"
                    type="date"
                    required
                    className="w-full rounded-lg border border-[#cccccc] bg-white px-3 py-2.5 pe-10 text-slate-900 outline-none transition focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20"
                  />
                  <Calendar
                    className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    aria-hidden
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">
                  {t("reg_governorate")}{" "}
                  <span className="text-red-600">{t("reg_required_suffix")}</span>
                </label>
                <input
                  name="governorate"
                  required
                  className="w-full rounded-lg border border-[#cccccc] bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">
                  {t("reg_mobile")}{" "}
                  <span className="text-red-600">{t("reg_required_suffix")}</span>
                </label>
                <input
                  name="mobile"
                  type="tel"
                  required
                  autoComplete="tel"
                  className="w-full rounded-lg border border-[#cccccc] bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">
                  {t("reg_website")}
                </label>
                <input
                  name="website"
                  type="url"
                  placeholder={t("reg_website_ph")}
                  className="w-full rounded-lg border border-[#cccccc] bg-white px-3 py-2.5 text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">
                  {t("reg_instagram")}
                </label>
                <input
                  name="instagram"
                  type="url"
                  placeholder={t("reg_instagram_ph")}
                  className="w-full rounded-lg border border-[#cccccc] bg-white px-3 py-2.5 text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20"
                />
              </div>
            </div>
          </section>

          {/* Section 2 — same card as S1/S3: navy title, gray prompt, full-rounded pills */}
          <section
            className="rounded-xl border p-6 md:p-8"
            style={{ borderColor: BORDER }}
          >
            <h3
              className="mb-3 text-base font-bold md:text-lg"
              style={{ color: PRIMARY }}
            >
              {t("reg_section2_title")}
            </h3>
            <p className="mb-6 text-sm text-slate-600 md:text-[15px]">
              {t("reg_sector_prompt")}
            </p>
            <div className="flex flex-wrap gap-2.5 md:gap-3">
              {SECTOR_IDS.map((id, index) => {
                const selected = sector === id;
                return (
                  <label
                    key={id}
                    className={cn(
                      "inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition",
                      selected ? "shadow-sm" : "hover:bg-slate-50/90"
                    )}
                    style={{
                      borderColor: selected ? PRIMARY : "#93c5fd",
                      backgroundColor: selected ? HEADER_BG : "#f8fafc",
                      color: PRIMARY,
                    }}
                  >
                    <input
                      type="radio"
                      name="sectorChoice"
                      value={id}
                      checked={selected}
                      onChange={() => setSector(id)}
                      className="h-4 w-4 shrink-0"
                      style={{ accentColor: PRIMARY }}
                    />
                    <span>{t(REG_SECTOR_KEYS[index])}</span>
                  </label>
                );
              })}
            </div>
            {sector === "s9" && (
              <div className="mt-6 flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">
                  {t("reg_other_detail_label")}{" "}
                  <span className="text-red-600">{t("reg_required_suffix")}</span>
                </label>
                <textarea
                  name="sectorOther"
                  value={otherDetail}
                  onChange={(e) => setOtherDetail(e.target.value)}
                  required={sector === "s9"}
                  rows={3}
                  className="w-full rounded-lg border border-[#cccccc] bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20"
                  placeholder={t("reg_other_detail_placeholder")}
                />
              </div>
            )}
          </section>

          {/* Section 3 */}
          <section
            className="rounded-xl border p-6 md:p-8"
            style={{ borderColor: BORDER }}
          >
            <h3
              className="mb-6 text-base font-bold md:text-lg"
              style={{ color: PRIMARY }}
            >
              {t("reg_section3_title")}
            </h3>
            <div className="grid gap-8 md:grid-cols-2">
              <FileUploadRow
                id={`${formId}-profile`}
                label={t("reg_doc_profile")}
                hint={t("reg_doc_profile_hint")}
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                inputName="fileProfile"
                fileKey="profile"
                fileName={files.profile}
                onChoose={onFileChange}
              />
              <FileUploadRow
                id={`${formId}-cr`}
                label={t("reg_doc_cr")}
                hint={t("reg_doc_cr_hint")}
                accept=".pdf,.png,.jpg,.jpeg,image/png,image/jpeg,application/pdf"
                inputName="fileCr"
                fileKey="cr"
                fileName={files.cr}
                onChoose={onFileChange}
              />
              <FileUploadRow
                id={`${formId}-riyada`}
                label={t("reg_doc_riyada")}
                hint={t("reg_doc_riyada_hint")}
                accept=".pdf,.png,.jpg,.jpeg,image/png,image/jpeg,application/pdf"
                inputName="fileRiyada"
                fileKey="riyada"
                fileName={files.riyada}
                onChoose={onFileChange}
              />
            </div>
          </section>

          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClear}
              disabled={submitting}
              className="min-h-11 rounded-lg border-2 bg-white px-8 py-2.5 text-sm font-bold transition hover:bg-slate-50 disabled:opacity-60"
              style={{ borderColor: PRIMARY, color: PRIMARY }}
            >
              {t("reg_clear")}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="min-h-11 rounded-lg px-8 py-2.5 text-sm font-bold text-white shadow-md transition hover:opacity-95 disabled:opacity-60"
              style={{ backgroundColor: PRIMARY }}
            >
              {submitting ? t("reg_submitting") : t("reg_submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}
