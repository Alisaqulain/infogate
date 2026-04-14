"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const services = [
  "SEO audit & strategy",
  "Local SEO",
  "National / organic SEO",
  "New website + SEO",
  "Content & blogs",
  "Not sure — advise me",
] as const;

type Status = "idle" | "loading" | "success" | "error";

export function LeadForm({
  className,
  heading = "Request a free SEO consultation",
  subheading = "Share your goals; we will respond with clear next steps.",
}: {
  className?: string;
  heading?: string;
  subheading?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

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
        setError(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("success");
      form.reset();
    } catch {
      setError("Network error. Check your connection and try again.");
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
        {heading}
      </h2>
      <p className="mt-2 text-sm text-slate-600">{subheading}</p>

      {status === "success" ? (
        <p
          className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900"
          role="status"
        >
          Thanks! Your details were sent. We will get back to you shortly.
        </p>
      ) : (
        <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-slate-800">
              Full name *
              <input
                name="name"
                required
                autoComplete="name"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none ring-blue-500/0 transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/15"
                placeholder="Your name"
              />
            </label>
            <label className="block text-sm font-semibold text-slate-800">
              Email *
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none ring-blue-500/0 transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/15"
                placeholder="you@company.com"
              />
            </label>
            <label className="block text-sm font-semibold text-slate-800">
              Phone
              <input
                name="phone"
                type="tel"
                autoComplete="tel"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none ring-blue-500/0 transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/15"
                placeholder="+91 …"
              />
            </label>
            <label className="block text-sm font-semibold text-slate-800">
              Company
              <input
                name="company"
                autoComplete="organization"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none ring-blue-500/0 transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/15"
                placeholder="Business name"
              />
            </label>
            <label className="block text-sm font-semibold text-slate-800 sm:col-span-2">
              Website (if any)
              <input
                name="website"
                type="url"
                autoComplete="url"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none ring-blue-500/0 transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/15"
                placeholder="https://"
              />
            </label>
          </div>
          <label className="block text-sm font-semibold text-slate-800">
            What do you need? *
            <select
              name="service"
              required
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none ring-blue-500/0 transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/15"
              defaultValue=""
            >
              <option value="" disabled>
                Select an option
              </option>
              {services.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-semibold text-slate-800">
            Tell us about your goals *
            <textarea
              name="message"
              required
              rows={4}
              className="mt-1.5 w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none ring-blue-500/0 transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/15"
              placeholder="e.g. rank for local keywords, redesign site, get more leads…"
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
            {status === "loading" ? "Sending…" : "Send to our team"}
          </button>
          <p className="text-xs text-slate-500">
            By submitting, you agree we may contact you about INFO GATE services.
            We never sell your data.
          </p>
        </form>
      )}
    </div>
  );
}
