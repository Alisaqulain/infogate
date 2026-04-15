"use client";

import { useState } from "react";
import { useTranslation } from "@/i18n/useTranslation";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "success" | "error";

export function LeadForm({
  className,
  heading,
  subheading,
}: {
  className?: string;
  heading?: string;
  subheading?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const services = [
    t("form_service_1"),
    t("form_service_2"),
    t("form_service_3"),
    t("form_service_4"),
    t("form_service_5"),
    t("form_service_6"),
  ] as const;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
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

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) {
        setError(data.error ?? t("form_error_generic"));
        setStatus("error");
        return;
      }
      setStatus("success");
      form.reset();
    } catch {
      setError(t("form_error_network"));
      setStatus("error");
    }
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-blue-100/80 bg-white/90 p-6 shadow-xl shadow-blue-500/10 backdrop-blur-sm sm:p-8",
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
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-slate-800">
              {t("form_full_name")}
              <input
                name="name"
                required
                autoComplete="name"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none ring-blue-500/0 transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/15"
                placeholder={t("form_full_name_ph")}
              />
            </label>
            <label className="block text-sm font-semibold text-slate-800">
              {t("form_email")}
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none ring-blue-500/0 transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/15"
                placeholder={t("form_email_ph")}
              />
            </label>
            <label className="block text-sm font-semibold text-slate-800">
              {t("form_phone")}
              <input
                name="phone"
                type="tel"
                autoComplete="tel"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none ring-blue-500/0 transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/15"
                placeholder={t("form_phone_ph")}
              />
            </label>
            <label className="block text-sm font-semibold text-slate-800">
              {t("form_company")}
              <input
                name="company"
                autoComplete="organization"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none ring-blue-500/0 transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/15"
                placeholder={t("form_company_ph")}
              />
            </label>
            <label className="block text-sm font-semibold text-slate-800 sm:col-span-2">
              {t("form_website")}
              <input
                name="website"
                type="url"
                autoComplete="url"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none ring-blue-500/0 transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/15"
                placeholder={t("form_website_ph")}
              />
            </label>
          </div>
          <label className="block text-sm font-semibold text-slate-800">
            {t("form_need")}
            <select
              name="service"
              required
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none ring-blue-500/0 transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/15"
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
          </label>
          <label className="block text-sm font-semibold text-slate-800">
            {t("form_goals")}
            <textarea
              name="message"
              required
              rows={4}
              className="mt-1.5 w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none ring-blue-500/0 transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/15"
              placeholder={t("form_goals_ph")}
            />
          </label>

          {error ? (
            <p
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
              role="alert"
            >
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-[200px] sm:px-8"
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
