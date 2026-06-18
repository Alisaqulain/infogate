"use client";

import { useCallback, useState } from "react";
import { useLocale } from "next-intl";
import { useTranslation } from "@/i18n/useTranslation";
import type { ApiErrorBody, ContactField } from "@/lib/form-api-errors";
import { isValidOptionalHttpUrl } from "@/lib/registration-validation";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "success" | "error";

const ERROR_SCROLL_ORDER: ContactField[] = [
  "name",
  "email",
  "website",
  "service",
  "message",
];

const CONTACT_ERROR_KEYS: Record<ContactField, string> = {
  name: "form_err_name",
  email: "form_err_email",
  service: "form_err_service",
  message: "form_err_message",
  website: "form_err_website",
};

export function LeadForm({
  className,
  heading,
  subheading,
  rtl = false,
}: {
  className?: string;
  heading?: string;
  subheading?: string;
  rtl?: boolean;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<ContactField, string>>
  >({});
  const { t } = useTranslation();
  const locale = useLocale();
  const isRtl = rtl || locale === "ar";

  const services = [
    t("form_service_1"),
    t("form_service_2"),
    t("form_service_3"),
    t("form_service_4"),
    t("form_service_5"),
    t("form_service_6"),
  ] as const;

  const clearFieldError = useCallback((key: ContactField) => {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const err = (k: ContactField) => fieldErrors[k];
  const inputRing = (k: ContactField) =>
    err(k) ? "border-red-500 ring-1 ring-red-200" : "";

  function validate(payload: Record<ContactField, string>) {
    const next: Partial<Record<ContactField, string>> = {};

    if (payload.name.length < 2) {
      next.name = t(CONTACT_ERROR_KEYS.name);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      next.email = t(CONTACT_ERROR_KEYS.email);
    }
    if (!payload.service) {
      next.service = t(CONTACT_ERROR_KEYS.service);
    }
    if (payload.message.length < 10) {
      next.message = t(CONTACT_ERROR_KEYS.message);
    }
    if (!isValidOptionalHttpUrl(payload.website)) {
      next.website = t(CONTACT_ERROR_KEYS.website);
    }

    return next;
  }

  function applyServerFieldError(data: ApiErrorBody) {
    if (data.field && data.field in CONTACT_ERROR_KEYS) {
      const key = data.field as ContactField;
      setFieldErrors({ [key]: t(CONTACT_ERROR_KEYS[key]) });
      document
        .getElementById(`contact-${key}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setServerError(data.error ?? t("form_error_generic"));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);
    setStatus("loading");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim(),
      company: String(fd.get("company") ?? "").trim(),
      website: String(fd.get("website") ?? "").trim(),
      service: String(fd.get("service") ?? "").trim(),
      message: String(fd.get("message") ?? "").trim(),
    };

    const next = validate(payload);
    setFieldErrors(next);
    if (Object.keys(next).length > 0) {
      setStatus("error");
      const first = ERROR_SCROLL_ORDER.find((k) => next[k]);
      if (first) {
        document
          .getElementById(`contact-${first}`)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as ApiErrorBody & { ok?: boolean };
      if (!res.ok || !data.ok) {
        applyServerFieldError(data);
        setStatus("error");
        return;
      }
      setFieldErrors({});
      setStatus("success");
      form.reset();
    } catch {
      setServerError(t("form_error_network"));
      setStatus("error");
    }
  }

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none ring-blue-500/0 transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/15";

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className={cn(
        "rounded-2xl border border-blue-100/80 bg-white/90 p-6 text-start shadow-xl shadow-blue-500/10 backdrop-blur-sm sm:p-8",
        className,
      )}
    >
      <h2 className="text-2xl font-bold tracking-tight text-slate-900">
        {heading ?? t("form_heading_default")}
      </h2>
      <p className="mt-2 text-sm text-slate-600">
        {subheading ?? t("form_subheading_default")}
      </p>

      {status === "success" ? (
        <p
          className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900"
          role="status"
        >
          {t("form_success")}
        </p>
      ) : (
        <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
          {Object.keys(fieldErrors).length > 0 ? (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            >
              {t("form_validation_banner")}
            </div>
          ) : null}
          {serverError ? (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            >
              {serverError}
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <div id="contact-name" className="block text-sm font-semibold text-slate-800">
              <label htmlFor="contact-name-input">
                {t("form_full_name")}
              </label>
              <input
                id="contact-name-input"
                name="name"
                required
                autoComplete="name"
                aria-invalid={err("name") ? true : undefined}
                aria-describedby={err("name") ? "contact-name-err" : undefined}
                onChange={() => clearFieldError("name")}
                className={cn(inputClass, inputRing("name"))}
                placeholder={t("form_full_name_ph")}
              />
              {err("name") ? (
                <p id="contact-name-err" className="mt-1 text-sm font-normal text-red-600">
                  {err("name")}
                </p>
              ) : null}
            </div>
            <div id="contact-email" className="block text-sm font-semibold text-slate-800">
              <label htmlFor="contact-email-input">
                {t("form_email")}
              </label>
              <input
                id="contact-email-input"
                name="email"
                type="email"
                required
                autoComplete="email"
                aria-invalid={err("email") ? true : undefined}
                aria-describedby={err("email") ? "contact-email-err" : undefined}
                onChange={() => clearFieldError("email")}
                className={cn(inputClass, inputRing("email"))}
                placeholder={t("form_email_ph")}
              />
              {err("email") ? (
                <p id="contact-email-err" className="mt-1 text-sm font-normal text-red-600">
                  {err("email")}
                </p>
              ) : null}
            </div>
            <div className="block text-sm font-semibold text-slate-800">
              <label htmlFor="contact-phone-input">
                {t("form_phone")}
              </label>
              <input
                id="contact-phone-input"
                name="phone"
                type="tel"
                autoComplete="tel"
                className={inputClass}
                placeholder={t("form_phone_ph")}
              />
            </div>
            <div className="block text-sm font-semibold text-slate-800">
              <label htmlFor="contact-company-input">
                {t("form_company")}
              </label>
              <input
                id="contact-company-input"
                name="company"
                autoComplete="organization"
                className={inputClass}
                placeholder={t("form_company_ph")}
              />
            </div>
            <div id="contact-website" className="block text-sm font-semibold text-slate-800 sm:col-span-2">
              <label htmlFor="contact-website-input">
                {t("form_website")}
              </label>
              <input
                id="contact-website-input"
                name="website"
                type="text"
                inputMode="url"
                autoComplete="url"
                aria-invalid={err("website") ? true : undefined}
                aria-describedby={err("website") ? "contact-website-err" : undefined}
                onChange={() => clearFieldError("website")}
                className={cn(inputClass, inputRing("website"))}
                placeholder={t("form_website_ph")}
              />
              {err("website") ? (
                <p id="contact-website-err" className="mt-1 text-sm font-normal text-red-600">
                  {err("website")}
                </p>
              ) : null}
            </div>
          </div>
          <div id="contact-service" className="block text-sm font-semibold text-slate-800">
            <label htmlFor="contact-service-input">
              {t("form_need")}
            </label>
            <select
              id="contact-service-input"
              name="service"
              required
              aria-invalid={err("service") ? true : undefined}
              aria-describedby={err("service") ? "contact-service-err" : undefined}
              onChange={() => clearFieldError("service")}
              className={cn(inputClass, inputRing("service"))}
              defaultValue=""
            >
              <option value="" disabled>
                {t("form_need_select")}
              </option>
              {services.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {err("service") ? (
              <p id="contact-service-err" className="mt-1 text-sm font-normal text-red-600">
                {err("service")}
              </p>
            ) : null}
          </div>
          <div id="contact-message" className="block text-sm font-semibold text-slate-800">
            <label htmlFor="contact-message-input">
              {t("form_goals")}
            </label>
            <textarea
              id="contact-message-input"
              name="message"
              required
              rows={4}
              aria-invalid={err("message") ? true : undefined}
              aria-describedby={err("message") ? "contact-message-err" : undefined}
              onChange={() => clearFieldError("message")}
              className={cn(inputClass, "resize-y", inputRing("message"))}
              placeholder={t("form_goals_ph")}
            />
            {err("message") ? (
              <p id="contact-message-err" className="mt-1 text-sm font-normal text-red-600">
                {err("message")}
              </p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 sm:ms-auto sm:w-auto sm:min-w-[200px] sm:px-8"
          >
            {status === "loading" ? t("form_sending") : t("form_submit")}
          </button>
          <p className="text-xs text-slate-500">
            {t("form_consent")}
          </p>
        </form>
      )}
    </div>
  );
}
