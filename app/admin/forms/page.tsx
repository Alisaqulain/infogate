"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { useAdminI18n } from "@/components/admin/admin-i18n";
import { RegistrationFilePreview } from "@/components/admin/registration-file-preview";
import {
  formatSubmittedAt,
  parseRegistrationSubmission,
  type RegistrationSubmission,
} from "@/lib/registration-admin";
import {
  downloadRegistrationsExcel,
  downloadRegistrationsPdf,
  downloadSingleRegistrationExcel,
  downloadSingleRegistrationPdf,
} from "@/lib/registration-export-client";
import { cn } from "@/lib/utils";

function DetailBlock({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-0.5 break-words text-sm font-medium text-slate-900">
        {value || "—"}
      </dd>
    </div>
  );
}

function FieldPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2">
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-0.5 break-words text-sm font-semibold text-slate-900">
        {value || "—"}
      </p>
    </div>
  );
}

type RegistrationCardProps = {
  item: RegistrationSubmission;
  selected: boolean;
  expanded: boolean;
  busy: boolean;
  deleting: boolean;
  alignClass: string;
  t: ReturnType<typeof useAdminI18n>["t"];
  fileNotStoredLabel: string;
  openPdfLabel: string;
  onToggleSelect: () => void;
  onToggleExpand: () => void;
  onExcel: () => void;
  onPdf: () => void;
  onDelete: () => void;
};

function RegistrationCard({
  item: it,
  selected,
  expanded,
  busy,
  deleting,
  alignClass,
  t,
  fileNotStoredLabel,
  openPdfLabel,
  onToggleSelect,
  onToggleExpand,
  onExcel,
  onPdf,
  onDelete,
}: RegistrationCardProps) {
  const m = it.meta;
  const rowBtn =
    "flex min-h-9 flex-1 items-center justify-center rounded-lg border px-2 py-1.5 text-xs font-bold transition disabled:opacity-50 sm:min-h-10 sm:text-sm";

  return (
    <article
      className={cn(
        "w-full rounded-2xl border bg-white p-4 shadow-sm transition",
        selected ? "border-blue-300 bg-blue-50/40 ring-1 ring-blue-200" : "border-slate-200"
      )}
    >
      <div className="flex gap-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggleSelect}
          disabled={busy}
          aria-label={`Select ${it.name}`}
          className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 text-blue-600"
        />
        <div className={cn("min-w-0 flex-1", alignClass)}>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="break-words text-base font-extrabold text-slate-900 sm:text-lg">
                {it.name}
              </h3>
              {m?.tradeName ? (
                <p className="mt-0.5 break-words text-sm text-slate-500">
                  {m.tradeName}
                </p>
              ) : null}
            </div>
            <time className="shrink-0 text-xs font-medium text-slate-500">
              {formatSubmittedAt(it.createdAt)}
            </time>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <FieldPill label="CR" value={m?.crNumber ?? ""} />
            <FieldPill label={t("mobile")} value={it.phone ?? ""} />
            <FieldPill
              label={t("governorate")}
              value={m?.governorateLabel ?? m?.governorate ?? ""}
            />
            <FieldPill label={t("sector")} value={m?.sectorLabel ?? ""} />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <button
              type="button"
              onClick={onToggleExpand}
              className={`${rowBtn} border-slate-200 text-slate-800 hover:bg-slate-50`}
            >
              {expanded ? t("hide") : t("view")}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={onExcel}
              className={`${rowBtn} border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-100`}
            >
              Excel
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={onPdf}
              className={`${rowBtn} border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100`}
            >
              PDF
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={onDelete}
              className={`${rowBtn} border-red-200 bg-red-50 text-red-800 hover:bg-red-100`}
            >
              {deleting ? t("deleting") : t("delete")}
            </button>
          </div>

          {expanded ? (
            <div className="mt-4 border-t border-slate-100 pt-4">
              <dl className="grid gap-3 sm:grid-cols-2">
                <DetailBlock
                  label={t("established")}
                  value={m?.establishment ?? ""}
                />
                <DetailBlock label="Website" value={m?.website ?? ""} />
                <DetailBlock label="Instagram" value={m?.instagram ?? ""} />
                <DetailBlock
                  label={t("sectorOther")}
                  value={m?.sectorOther ?? ""}
                />
              </dl>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <RegistrationFilePreview
                  submissionId={it.id}
                  fileKey="profile"
                  label={t("profileFile")}
                  meta={m?.files?.profile}
                  fileNotStoredLabel={fileNotStoredLabel}
                  openPdfLabel={openPdfLabel}
                />
                <RegistrationFilePreview
                  submissionId={it.id}
                  fileKey="commercialReg"
                  label={t("crFile")}
                  meta={m?.files?.commercialReg}
                  fileNotStoredLabel={fileNotStoredLabel}
                  openPdfLabel={openPdfLabel}
                />
                <RegistrationFilePreview
                  submissionId={it.id}
                  fileKey="riyada"
                  label={t("riyadaFile")}
                  meta={m?.files?.riyada}
                  fileNotStoredLabel={fileNotStoredLabel}
                  openPdfLabel={openPdfLabel}
                />
              </div>
              {it.message ? (
                <pre className="mt-3 max-h-40 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs whitespace-pre-wrap text-slate-700">
                  {it.message}
                </pre>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default function AdminOsusRegistrationsPage() {
  const { t, dir } = useAdminI18n();
  const [items, setItems] = useState<RegistrationSubmission[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [exporting, setExporting] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const busy = !!exporting || !!deletingId || bulkDeleting;
  const alignClass = dir === "rtl" ? "text-right" : "text-left";

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
      setSelected(new Set());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load registrations");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const selectedItems = useMemo(
    () => items.filter((i) => selected.has(i.id)),
    [items, selected]
  );

  const allSelected = items.length > 0 && selected.size === items.length;

  function toggleAll() {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(items.map((i) => i.id)));
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function runExport(key: string, fn: () => Promise<void>) {
    setExporting(key);
    setError(null);
    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Export failed");
    } finally {
      setExporting(null);
    }
  }

  function removeFromList(ids: Set<string>) {
    setItems((prev) => prev.filter((i) => !ids.has(i.id)));
    setTotal((prev) => Math.max(0, prev - ids.size));
    setSelected((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.delete(id));
      return next;
    });
    setExpandedId((prev) => (prev && ids.has(prev) ? null : prev));
  }

  async function onDeleteOne(id: string, name: string) {
    if (busy) return;
    if (!window.confirm(`${t("confirmDeleteOne")}\n\n${name}`)) return;

    setDeletingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/forms/${id}`, { method: "DELETE" });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) throw new Error(data.error || "Delete failed");
      removeFromList(new Set([id]));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setDeletingId(null);
    }
  }

  async function onBulkDelete() {
    if (busy || selected.size === 0) return;
    if (!window.confirm(t("confirmDeleteBulk"))) return;

    setBulkDeleting(true);
    setError(null);
    const ids = [...selected];
    try {
      const res = await fetch("/api/admin/forms/bulk-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok) throw new Error(data.error || "Bulk delete failed");
      removeFromList(new Set(ids));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bulk delete failed");
    } finally {
      setBulkDeleting(false);
    }
  }

  const btn =
    "inline-flex w-full min-h-10 items-center justify-center rounded-xl border px-3 py-2.5 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm";
  const btnPrimary = `${btn} border-blue-700 bg-gradient-to-r from-blue-700 to-cyan-600 text-white shadow-sm hover:brightness-110`;
  const btnSecondary = `${btn} border-slate-200 bg-white text-slate-800 hover:bg-slate-50`;
  const btnDanger = `${btn} border-red-200 bg-red-50 text-red-800 hover:bg-red-100`;

  return (
    <AdminShell>
      <div className="w-full min-w-0 space-y-4 sm:space-y-6">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-[#0a192f] via-[#0d2137] to-[#134074] p-4 text-white shadow-lg sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300/90">
            Osus Program
          </p>
          <h1 className="mt-2 text-xl font-extrabold tracking-tight sm:text-3xl">
            {t("osusRegistrations")}
          </h1>
          <p className="mt-2 text-sm text-slate-200/90">{t("osusRegistrationsDesc")}</p>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
            <div className="rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 backdrop-blur-sm sm:px-4 sm:py-3">
              <p className="text-[10px] font-bold uppercase text-cyan-200/80">
                {t("totalSubmissions")}
              </p>
              <p className="text-xl font-black sm:text-2xl">
                {loading ? "…" : total}
              </p>
            </div>
            <div className="rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 backdrop-blur-sm sm:px-4 sm:py-3">
              <p className="text-[10px] font-bold uppercase text-cyan-200/80">
                {t("selected")}
              </p>
              <p className="text-xl font-black sm:text-2xl">{selected.size}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-5">
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">
            {t("bulkActions")}
          </p>
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-3 xl:grid-cols-6">
            <button
              type="button"
              disabled={loading || items.length === 0 || busy}
              onClick={() =>
                void runExport("all-xlsx", () =>
                  downloadRegistrationsExcel(items, "osus-registrations-all")
                )
              }
              className={btnPrimary}
            >
              {exporting === "all-xlsx" ? "…" : t("exportAllExcel")}
            </button>
            <button
              type="button"
              disabled={loading || items.length === 0 || busy}
              onClick={() =>
                void runExport("all-pdf", () =>
                  downloadRegistrationsPdf(items, "osus-registrations-all")
                )
              }
              className={btnSecondary}
            >
              {exporting === "all-pdf" ? "…" : t("exportAllPdf")}
            </button>
            <button
              type="button"
              disabled={selected.size === 0 || busy}
              onClick={() =>
                void runExport("sel-xlsx", () =>
                  downloadRegistrationsExcel(
                    selectedItems,
                    "osus-registrations-selected"
                  )
                )
              }
              className={btnPrimary}
            >
              {exporting === "sel-xlsx" ? "…" : t("exportSelectedExcel")}
            </button>
            <button
              type="button"
              disabled={selected.size === 0 || busy}
              onClick={() =>
                void runExport("sel-pdf", () =>
                  downloadRegistrationsPdf(
                    selectedItems,
                    "osus-registrations-selected"
                  )
                )
              }
              className={btnSecondary}
            >
              {exporting === "sel-pdf" ? "…" : t("exportSelectedPdf")}
            </button>
            <button
              type="button"
              disabled={selected.size === 0 || busy}
              onClick={() => void onBulkDelete()}
              className={btnDanger}
            >
              {bulkDeleting ? t("deleting") : t("deleteSelected")}
            </button>
            <button
              type="button"
              onClick={load}
              disabled={loading || busy}
              className={btnSecondary}
            >
              {t("refresh")}
            </button>
          </div>
        </div>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        ) : null}

        <div className="w-full min-w-0 space-y-3">
          {items.length > 0 ? (
            <label
              className={cn(
                "flex w-full cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm",
                alignClass
              )}
            >
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                disabled={loading || busy}
                className="h-4 w-4 shrink-0 rounded border-slate-300 text-blue-600"
              />
              <span className="text-sm font-bold text-slate-800">
                {t("selectAll")} ({items.length})
              </span>
            </label>
          ) : null}

          {loading ? (
            <p className="rounded-2xl border border-slate-200 bg-white py-12 text-center text-slate-500">
              {t("loading")}
            </p>
          ) : null}

          {!loading && items.length === 0 ? (
            <p className="rounded-2xl border border-slate-200 bg-white py-12 text-center text-slate-600">
              {t("noRegistrations")}
            </p>
          ) : null}

          {!loading
            ? items.map((it) => (
                <RegistrationCard
                  key={it.id}
                  item={it}
                  selected={selected.has(it.id)}
                  expanded={expandedId === it.id}
                  busy={busy}
                  deleting={deletingId === it.id}
                  alignClass={alignClass}
                  t={t}
                  fileNotStoredLabel={t("fileNotStored")}
                  openPdfLabel={t("openPdf")}
                  onToggleSelect={() => toggleOne(it.id)}
                  onToggleExpand={() =>
                    setExpandedId((prev) => (prev === it.id ? null : it.id))
                  }
                  onExcel={() =>
                    void runExport(`row-xlsx-${it.id}`, () =>
                      downloadSingleRegistrationExcel(it)
                    )
                  }
                  onPdf={() =>
                    void runExport(`row-pdf-${it.id}`, () =>
                      downloadSingleRegistrationPdf(it)
                    )
                  }
                  onDelete={() => void onDeleteOne(it.id, it.name)}
                />
              ))
            : null}
        </div>
      </div>
    </AdminShell>
  );
}
