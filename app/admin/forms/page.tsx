"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { useAdminI18n } from "@/components/admin/admin-i18n";

type FormItem = {
  id: string;
  type: "contact" | "quote";
  name: string;
  email: string;
  phone: string | null;
  message: string;
  meta: unknown;
  createdAt: string;
};

export default function AdminFormsPage() {
  const { t, dir } = useAdminI18n();
  const [items, setItems] = useState<FormItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const alignClass = useMemo(() => (dir === "rtl" ? "text-right" : "text-left"), [dir]);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/forms");
      const data = (await res.json()) as { ok?: boolean; error?: string; items?: FormItem[]; total?: number };
      if (!res.ok) throw new Error(data.error || "Failed to load submissions");
      setItems(Array.isArray(data.items) ? data.items : []);
      setTotal(typeof data.total === "number" ? data.total : 0);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load submissions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function onDelete(id: string) {
    if (deletingId) return;
    const ok = window.confirm("Delete this submission? This cannot be undone.");
    if (!ok) return;

    setDeletingId(id);
    setError(null);
    try {
      const res = await fetch(`/api/forms/${id}`, { method: "DELETE" });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setItems((prev) => prev.filter((x) => x.id !== id));
      setTotal((prev) => Math.max(0, prev - 1));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <AdminShell>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">{t("forms")}</h1>
            <p className="mt-1 text-sm text-slate-600">
              {loading ? "Loading…" : `${items.length} shown · ${total} total`}
            </p>
          </div>
          <button
            onClick={load}
            disabled={loading}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-800 hover:bg-slate-50 disabled:opacity-60"
          >
            Refresh
          </button>
        </div>

        {error ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        ) : null}

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr className="text-xs font-extrabold uppercase tracking-wide text-slate-600">
                <th className={["sticky top-0 bg-white px-3 py-2", alignClass].join(" ")}>When</th>
                <th className={["sticky top-0 bg-white px-3 py-2", alignClass].join(" ")}>Type</th>
                <th className={["sticky top-0 bg-white px-3 py-2", alignClass].join(" ")}>Name</th>
                <th className={["sticky top-0 bg-white px-3 py-2", alignClass].join(" ")}>Email</th>
                <th className={["sticky top-0 bg-white px-3 py-2", alignClass].join(" ")}>Phone</th>
                <th className={["sticky top-0 bg-white px-3 py-2", alignClass].join(" ")}>Message</th>
                <th className="sticky top-0 bg-white px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && !loading ? (
                <tr>
                  <td className="px-3 py-6 text-sm text-slate-600" colSpan={7}>
                    No submissions yet.
                  </td>
                </tr>
              ) : null}
              {items.map((it) => (
                <tr key={it.id} className="border-t border-slate-100 align-top text-sm">
                  <td className={["whitespace-nowrap px-3 py-3 text-slate-700", alignClass].join(" ")}>
                    {new Date(it.createdAt).toLocaleString()}
                  </td>
                  <td className={["whitespace-nowrap px-3 py-3 text-slate-700", alignClass].join(" ")}>
                    {it.type}
                  </td>
                  <td className={["whitespace-nowrap px-3 py-3 font-semibold text-slate-900", alignClass].join(" ")}>
                    {it.name}
                  </td>
                  <td className={["whitespace-nowrap px-3 py-3 text-slate-700", alignClass].join(" ")}>
                    <a className="underline decoration-slate-300 underline-offset-2" href={`mailto:${it.email}`}>
                      {it.email}
                    </a>
                  </td>
                  <td className={["whitespace-nowrap px-3 py-3 text-slate-700", alignClass].join(" ")}>
                    {it.phone ?? "—"}
                  </td>
                  <td className={["px-3 py-3 text-slate-800", alignClass].join(" ")}>
                    <div className="max-w-[36rem] whitespace-pre-wrap break-words">
                      {it.message}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-right">
                    <button
                      onClick={() => onDelete(it.id)}
                      disabled={deletingId === it.id}
                      className="rounded-xl border border-red-200 bg-white px-3 py-1.5 text-xs font-extrabold text-red-700 hover:bg-red-50 disabled:opacity-60"
                    >
                      {deletingId === it.id ? "Deleting…" : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}

