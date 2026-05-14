"use client";

import { useTranslations, useLocale } from "next-intl";
import { Calendar } from "lucide-react";
import {
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { RegistrationSuccessDialog } from "@/components/registration-success-dialog";
import {
  REG_FILE_ACCEPT_ATTR,
  REG_GOVERNORATE_SLUGS,
} from "@/lib/registration-constants";
import {
  isValidEstablishmentDate,
  isValidOmanMobile,
  isValidOptionalHttpUrl,
  isValidOptionalInstagram,
  validateRegistrationFile,
} from "@/lib/registration-validation";
import { cn } from "@/lib/utils";

const PRIMARY = "#003366";
const HEADER_BG = "#f0f7ff";
const BORDER = "#cccccc";

/** Stable DOM ids (avoid `useId()` colons in querySelector / scroll targets). */
const FID = "program-registration";

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

type FieldErrorKey =
  | "companyName"
  | "crNumber"
  | "establishment"
  | "governorate"
  | "mobile"
  | "website"
  | "instagram"
  | "sector"
  | "sectorOther"
  | "fileProfile"
  | "fileCr"
  | "fileRiyada";

const ERROR_SCROLL_ORDER: FieldErrorKey[] = [
  "companyName",
  "crNumber",
  "establishment",
  "governorate",
  "mobile",
  "website",
  "instagram",
  "sector",
  "sectorOther",
  "fileProfile",
  "fileCr",
  "fileRiyada",
];

function FileUploadRow({
  id,
  label,
  hint,
  accept,
  inputName,
  fileKey,
  fileName,
  error,
  onChoose,
}: {
  id: string;
  label: string;
  hint: string;
  accept: string;
  inputName: string;
  fileKey: "profile" | "cr" | "riyada";
  fileName: string | null;
  error?: string | null;
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
        className={cn(
          "flex min-h-[46px] flex-wrap items-center gap-3 rounded-lg border bg-white px-3 py-2",
          error && "border-red-500 ring-1 ring-red-200"
        )}
        style={{ borderColor: error ? undefined : BORDER }}
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
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-err` : undefined}
          onChange={(e) => onChoose(fileKey, e)}
        />
      </div>
      {error ? (
        <p id={`${id}-err`} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
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

  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<FieldErrorKey, string>>
  >({});
  const [serverError, setServerError] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const establishmentMax = useMemo(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  }, []);

  const clearFieldError = useCallback((key: FieldErrorKey) => {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const onFileChange = useCallback(
    (key: "profile" | "cr" | "riyada", e: ChangeEvent<HTMLInputElement>) => {
      const map: Record<typeof key, FieldErrorKey> = {
        profile: "fileProfile",
        cr: "fileCr",
        riyada: "fileRiyada",
      };
      const errKey = map[key];
      const f = e.target.files?.[0];
      clearFieldError(errKey);
      if (!f) {
        setFiles((prev) => ({ ...prev, [key]: null }));
        return;
      }
      const v = validateRegistrationFile(f);
      if (v === "size") {
        e.target.value = "";
        setFiles((prev) => ({ ...prev, [key]: null }));
        setFieldErrors((prev) => ({
          ...prev,
          [errKey]: t("reg_err_file_size"),
        }));
        return;
      }
      if (v === "type") {
        e.target.value = "";
        setFiles((prev) => ({ ...prev, [key]: null }));
        setFieldErrors((prev) => ({
          ...prev,
          [errKey]: t("reg_err_file_type"),
        }));
        return;
      }
      setFiles((prev) => ({ ...prev, [key]: f.name }));
    },
    [clearFieldError, t]
  );

  const resetFiles = () => {
    setFiles({ profile: null, cr: null, riyada: null });
  };

  const handleClear = () => {
    formRef.current?.reset();
    setSector("");
    setOtherDetail("");
    resetFiles();
    setFieldErrors({});
    setServerError(null);
    const form = formRef.current;
    if (form) {
      const names = ["fileProfile", "fileCr", "fileRiyada"] as const;
      for (const n of names) {
        const el = form.elements.namedItem(n);
        if (el instanceof HTMLInputElement) el.value = "";
      }
    }
  };

  const validateDomFiles = useCallback(
    (form: HTMLFormElement, errs: Partial<Record<FieldErrorKey, string>>) => {
      const check = (name: "fileProfile" | "fileCr" | "fileRiyada", key: FieldErrorKey) => {
        const el = form.elements.namedItem(name);
        if (!(el instanceof HTMLInputElement) || !el.files?.length) return;
        const f = el.files[0];
        const v = validateRegistrationFile(f);
        if (v === "size") errs[key] = t("reg_err_file_size");
        if (v === "type") errs[key] = t("reg_err_file_type");
      };
      check("fileProfile", "fileProfile");
      check("fileCr", "fileCr");
      check("fileRiyada", "fileRiyada");
    },
    [t]
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setServerError(null);

    const fd = new FormData(form);
    const companyName = String(fd.get("companyName") ?? "").trim();
    const crNumber = String(fd.get("crNumber") ?? "").trim();
    const establishment = String(fd.get("establishment") ?? "").trim();
    const governorate = String(fd.get("governorate") ?? "").trim();
    const mobile = String(fd.get("mobile") ?? "").trim();
    const website = String(fd.get("website") ?? "").trim();
    const instagram = String(fd.get("instagram") ?? "").trim();

    const next: Partial<Record<FieldErrorKey, string>> = {};

    if (companyName.length < 2) {
      next.companyName = t("reg_err_company");
    }
    if (!crNumber) {
      next.crNumber = t("reg_err_cr");
    }
    if (!establishment) {
      next.establishment = t("reg_err_establishment");
    } else if (!isValidEstablishmentDate(establishment)) {
      next.establishment = t("reg_err_establishment");
    }
    if (!governorate) {
      next.governorate = t("reg_err_governorate");
    }
    if (!mobile || !isValidOmanMobile(mobile)) {
      next.mobile = t("reg_err_mobile");
    }
    if (!isValidOptionalHttpUrl(website)) {
      next.website = t("reg_err_website");
    }
    if (!isValidOptionalInstagram(instagram)) {
      next.instagram = t("reg_err_instagram");
    }
    if (!sector) {
      next.sector = t("reg_err_sector");
    }
    if (sector === "s9" && otherDetail.trim().length < 2) {
      next.sectorOther = t("reg_err_sector_other");
    }

    validateDomFiles(form, next);

    setFieldErrors(next);
    const hasErrors = Object.keys(next).length > 0;
    if (hasErrors) {
      const first = ERROR_SCROLL_ORDER.find((k) => next[k]);
      if (first) {
        document
          .getElementById(`${FID}-${first}`)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setSubmitting(true);
    try {
      fd.set("locale", locale);
      const res = await fetch("/api/registration", {
        method: "POST",
        body: fd,
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setServerError(data.error ?? t("reg_err_submit"));
        return;
      }
      handleClear();
      setSuccessOpen(true);
    } catch {
      setServerError(t("reg_err_submit"));
    } finally {
      setSubmitting(false);
    }
  };

  const arabicFont = locale === "ar";
  const err = (k: FieldErrorKey) => fieldErrors[k];
  const inputRing = (k: FieldErrorKey) =>
    err(k) ? "border-red-500 ring-1 ring-red-200" : "";

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
          "mx-auto w-full max-w-6xl px-3 pb-16 pt-8 sm:px-6 md:pb-24 md:pt-10",
          arabicFont && "font-arabic"
        )}
      >
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
            noValidate
          >
            {Object.keys(fieldErrors).length > 0 ? (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
              >
                {t("reg_validation_banner")}
              </div>
            ) : null}
            {serverError ? (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
              >
                {serverError}
              </div>
            ) : null}

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
                  <label
                    className="text-sm font-semibold text-slate-700"
                    htmlFor={`${FID}-companyName`}
                  >
                    {t("reg_company_name")}{" "}
                    <span className="text-red-600">{t("reg_required_suffix")}</span>
                  </label>
                  <input
                    id={`${FID}-companyName`}
                    name="companyName"
                    autoComplete="organization"
                    aria-invalid={err("companyName") ? true : undefined}
                    aria-describedby={
                      err("companyName") ? `${FID}-companyName-err` : undefined
                    }
                    onChange={() => clearFieldError("companyName")}
                    className={cn(
                      "w-full rounded-lg border border-[#cccccc] bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20",
                      inputRing("companyName")
                    )}
                  />
                  {err("companyName") ? (
                    <p id={`${FID}-companyName-err`} className="text-sm text-red-600">
                      {err("companyName")}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    className="text-sm font-semibold text-slate-700"
                    htmlFor={`${FID}-tradeName`}
                  >
                    {t("reg_trade_name")}
                  </label>
                  <input
                    id={`${FID}-tradeName`}
                    name="tradeName"
                    autoComplete="off"
                    className="w-full rounded-lg border border-[#cccccc] bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    className="text-sm font-semibold text-slate-700"
                    htmlFor={`${FID}-crNumber`}
                  >
                    {t("reg_cr")}{" "}
                    <span className="text-red-600">{t("reg_required_suffix")}</span>
                  </label>
                  <input
                    id={`${FID}-crNumber`}
                    name="crNumber"
                    autoComplete="off"
                    aria-invalid={err("crNumber") ? true : undefined}
                    aria-describedby={
                      err("crNumber") ? `${FID}-crNumber-err` : undefined
                    }
                    onChange={() => clearFieldError("crNumber")}
                    className={cn(
                      "w-full rounded-lg border border-[#cccccc] bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20",
                      inputRing("crNumber")
                    )}
                  />
                  {err("crNumber") ? (
                    <p id={`${FID}-crNumber-err`} className="text-sm text-red-600">
                      {err("crNumber")}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    className="text-sm font-semibold text-slate-700"
                    htmlFor={`${FID}-establishment`}
                  >
                    {t("reg_establishment")}{" "}
                    <span className="text-red-600">{t("reg_required_suffix")}</span>
                  </label>
                  <div className="relative">
                    <input
                      id={`${FID}-establishment`}
                      name="establishment"
                      type="date"
                      min="1900-01-01"
                      max={establishmentMax}
                      aria-invalid={err("establishment") ? true : undefined}
                      aria-describedby={
                        err("establishment") ? `${FID}-establishment-err` : undefined
                      }
                      onChange={() => clearFieldError("establishment")}
                      className={cn(
                        "w-full rounded-lg border border-[#cccccc] bg-white px-3 py-2.5 pe-10 text-slate-900 outline-none transition focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20",
                        inputRing("establishment")
                      )}
                    />
                    <Calendar
                      className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                      aria-hidden
                    />
                  </div>
                  {err("establishment") ? (
                    <p id={`${FID}-establishment-err`} className="text-sm text-red-600">
                      {err("establishment")}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    className="text-sm font-semibold text-slate-700"
                    htmlFor={`${FID}-governorate`}
                  >
                    {t("reg_governorate")}{" "}
                    <span className="text-red-600">{t("reg_required_suffix")}</span>
                  </label>
                  <select
                    id={`${FID}-governorate`}
                    name="governorate"
                    defaultValue=""
                    aria-invalid={err("governorate") ? true : undefined}
                    aria-describedby={
                      err("governorate") ? `${FID}-governorate-err` : undefined
                    }
                    onChange={() => clearFieldError("governorate")}
                    className={cn(
                      "w-full rounded-lg border border-[#cccccc] bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20",
                      inputRing("governorate")
                    )}
                  >
                    <option value="" disabled>
                      {t("reg_gov_placeholder")}
                    </option>
                    {REG_GOVERNORATE_SLUGS.map((slug) => (
                      <option key={slug} value={slug}>
                        {t(`reg_gov_${slug}`)}
                      </option>
                    ))}
                  </select>
                  {err("governorate") ? (
                    <p id={`${FID}-governorate-err`} className="text-sm text-red-600">
                      {err("governorate")}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    className="text-sm font-semibold text-slate-700"
                    htmlFor={`${FID}-mobile`}
                  >
                    {t("reg_mobile")}{" "}
                    <span className="text-red-600">{t("reg_required_suffix")}</span>
                  </label>
                  <input
                    id={`${FID}-mobile`}
                    name="mobile"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="+968 9XXXXXXX"
                    aria-invalid={err("mobile") ? true : undefined}
                    aria-describedby={
                      err("mobile") ? `${FID}-mobile-err` : undefined
                    }
                    onChange={() => clearFieldError("mobile")}
                    className={cn(
                      "w-full rounded-lg border border-[#cccccc] bg-white px-3 py-2.5 text-slate-900 outline-none transition focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20",
                      inputRing("mobile")
                    )}
                  />
                  {err("mobile") ? (
                    <p id={`${FID}-mobile-err`} className="text-sm text-red-600">
                      {err("mobile")}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    className="text-sm font-semibold text-slate-700"
                    htmlFor={`${FID}-website`}
                  >
                    {t("reg_website")}
                  </label>
                  <input
                    id={`${FID}-website`}
                    name="website"
                    type="text"
                    inputMode="url"
                    autoComplete="url"
                    placeholder={t("reg_website_ph")}
                    aria-invalid={err("website") ? true : undefined}
                    aria-describedby={
                      err("website") ? `${FID}-website-err` : undefined
                    }
                    onChange={() => clearFieldError("website")}
                    className={cn(
                      "w-full rounded-lg border border-[#cccccc] bg-white px-3 py-2.5 text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20",
                      inputRing("website")
                    )}
                  />
                  {err("website") ? (
                    <p id={`${FID}-website-err`} className="text-sm text-red-600">
                      {err("website")}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    className="text-sm font-semibold text-slate-700"
                    htmlFor={`${FID}-instagram`}
                  >
                    {t("reg_instagram")}
                  </label>
                  <input
                    id={`${FID}-instagram`}
                    name="instagram"
                    type="text"
                    autoComplete="off"
                    placeholder={t("reg_instagram_ph")}
                    aria-invalid={err("instagram") ? true : undefined}
                    aria-describedby={
                      err("instagram") ? `${FID}-instagram-err` : undefined
                    }
                    onChange={() => clearFieldError("instagram")}
                    className={cn(
                      "w-full rounded-lg border border-[#cccccc] bg-white px-3 py-2.5 text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20",
                      inputRing("instagram")
                    )}
                  />
                  {err("instagram") ? (
                    <p id={`${FID}-instagram-err`} className="text-sm text-red-600">
                      {err("instagram")}
                    </p>
                  ) : null}
                </div>
              </div>
            </section>

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
              {err("sector") ? (
                <p
                  id={`${FID}-sector-err`}
                  className="mb-3 text-sm text-red-600"
                  role="alert"
                >
                  {err("sector")}
                </p>
              ) : null}
              <fieldset className="min-w-0 border-0 p-0">
                <legend className="sr-only">{t("reg_sector_prompt")}</legend>
                <div id={`${FID}-sector`} className="flex flex-wrap gap-2.5 md:gap-3">
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
                          onChange={() => {
                            setSector(id);
                            clearFieldError("sector");
                          }}
                          className="h-4 w-4 shrink-0"
                          style={{ accentColor: PRIMARY }}
                        />
                        <span>{t(REG_SECTOR_KEYS[index])}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
              {sector === "s9" && (
                <div className="mt-6 flex flex-col gap-2">
                  <label
                    className="text-sm font-semibold text-slate-700"
                    htmlFor={`${FID}-sectorOther`}
                  >
                    {t("reg_other_detail_label")}{" "}
                    <span className="text-red-600">{t("reg_required_suffix")}</span>
                  </label>
                  <textarea
                    id={`${FID}-sectorOther`}
                    name="sectorOther"
                    value={otherDetail}
                    onChange={(e) => {
                      setOtherDetail(e.target.value);
                      clearFieldError("sectorOther");
                    }}
                    rows={3}
                    aria-invalid={err("sectorOther") ? true : undefined}
                    aria-describedby={
                      err("sectorOther") ? `${FID}-sectorOther-err` : undefined
                    }
                    className={cn(
                      "w-full rounded-lg border border-[#cccccc] bg-white px-3 py-2.5 text-slate-900 outline-none focus:border-[#003366] focus:ring-2 focus:ring-[#003366]/20",
                      inputRing("sectorOther")
                    )}
                    placeholder={t("reg_other_detail_placeholder")}
                  />
                  {err("sectorOther") ? (
                    <p id={`${FID}-sectorOther-err`} className="text-sm text-red-600">
                      {err("sectorOther")}
                    </p>
                  ) : null}
                </div>
              )}
            </section>

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
                <div id={`${FID}-fileProfile`}>
                  <FileUploadRow
                    id={`${formId}-profile`}
                    label={t("reg_doc_profile")}
                    hint={t("reg_doc_profile_hint")}
                    accept={REG_FILE_ACCEPT_ATTR}
                    inputName="fileProfile"
                    fileKey="profile"
                    fileName={files.profile}
                    error={err("fileProfile")}
                    onChoose={onFileChange}
                  />
                </div>
                <div id={`${FID}-fileCr`}>
                  <FileUploadRow
                    id={`${formId}-cr`}
                    label={t("reg_doc_cr")}
                    hint={t("reg_doc_cr_hint")}
                    accept={REG_FILE_ACCEPT_ATTR}
                    inputName="fileCr"
                    fileKey="cr"
                    fileName={files.cr}
                    error={err("fileCr")}
                    onChoose={onFileChange}
                  />
                </div>
                <div id={`${FID}-fileRiyada`}>
                  <FileUploadRow
                    id={`${formId}-riyada`}
                    label={t("reg_doc_riyada")}
                    hint={t("reg_doc_riyada_hint")}
                    accept={REG_FILE_ACCEPT_ATTR}
                    inputName="fileRiyada"
                    fileKey="riyada"
                    fileName={files.riyada}
                    error={err("fileRiyada")}
                    onChoose={onFileChange}
                  />
                </div>
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
