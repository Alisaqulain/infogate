"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { useAdminI18n } from "@/components/admin/admin-i18n";
import { parseRegistrationSubmission, type RegistrationSubmission } from "@/lib/registration-admin";
import {
  downloadRegistrationsExcel,
  downloadRegistrationsPdf,
  downloadRegistrationsZip,
} from "@/lib/registration-export-client";

export default function AdminOsusRegistrationsPage() {
  const { t } = useAdminI18n();
  const [items, setItems] = useState<RegistrationSubmission[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState<"excel" | "pdf" | "zip" | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/forms?type=registration&limit=200");
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        items?: Array<{
          id: string;
          name: string;
          phone?: string | null;
          message?: string | null;
          meta?: unknown;
          createdAt: string;
        }>;
        total?: number;
      };
      if (!res.ok) throw new Error(data.error || "Failed to load registrations");
      const parsed = (data.items ?? []).map(parseRegistrationSubmission);
      setItems(parsed);
      setTotal(typeof data.total === "number" ? data.total : parsed.length);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load registrations");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function runExport(kind: "excel" | "pdf" | "zip") {
    if (items.length === 0) return;
    setExporting(kind);
    setError(null);
    try {
      if (kind === "excel") {
        await downloadRegistrationsExcel(items, "osus-registrations");
      } else if (kind === "pdf") {
        await downloadRegistrationsPdf(items, "osus-registrations");
      } else {
        await downloadRegistrationsZip(items, "osus-registrations");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Export failed");
    } finally {
      setExporting(null);
    }
  }

  const btn =
    "inline-flex min-h-12 w-full items-center justify-center rounded-xl border px-6 py-3 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-14 sm:text-base";
  const btnExcel = `${btn} border-[#0a2744] bg-[#0a2744] shadow-md hover:brightness-110`;
  const btnPdf = `${btn} border-[#2b6cb0] bg-[#2b6cb0] shadow-md hover:brightness-110`;
  const btnZip = `${btn} border-[#5eb3e8] bg-[#5eb3e8] shadow-md hover:brightness-110`;

  return (
    <AdminShell>
      <div className="w-full min-w-0">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-[#0a192f] via-[#0d2137] to-[#134074] p-6 text-white shadow-lg sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300/90">
            Osus Program
          </p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
            {t("osusRegistrations")}
          </h1>
          {!loading ? (
            <p className="mt-3 text-sm text-cyan-100/90">
              {t("totalSubmissions")}: <span className="font-black">{total}</span>
            </p>
          ) : null}
        </div>

        {error ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        ) : null}

        <div className="mt-6 grid max-w-lg gap-3 sm:gap-4">
          <button
            type="button"
            disabled={loading || items.length === 0 || !!exporting}
            onClick={() => void runExport("excel")}
            className={btnExcel}
          >
            {exporting === "excel" ? t("loading") : t("downloadExcel")}
          </button>
          <button
            type="button"
            disabled={loading || items.length === 0 || !!exporting}
            onClick={() => void runExport("pdf")}
            className={btnPdf}
          >
            {exporting === "pdf" ? t("loading") : t("downloadPdf")}
          </button>
          <button
            type="button"
            disabled={loading || items.length === 0 || !!exporting}
            onClick={() => void runExport("zip")}
            className={btnZip}
          >
            {exporting === "zip" ? t("loading") : t("downloadZip")}
          </button>
        </div>

        {loading ? (
          <p className="mt-6 text-center text-sm text-slate-500">{t("loading")}</p>
        ) : null}
        {!loading && items.length === 0 ? (
          <p className="mt-6 text-center text-sm text-slate-600">
            {t("noRegistrations")}
          </p>
        ) : null}

        {/*
          ——— Full registration dashboard (hidden for now) ———
          Cards, select-all, per-row Excel/PDF/Delete, bulk selected exports,
          file previews, refresh, etc. Re-enable by restoring previous page.tsx.

        <RegistrationCard /> … bulk actions … delete …
        */}
      </div>
    </AdminShell>
  );
}
