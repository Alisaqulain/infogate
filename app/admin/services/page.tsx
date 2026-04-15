"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AdminShell } from "@/components/admin/admin-shell";
import { useAdminI18n } from "@/components/admin/admin-i18n";

type ServiceItem = {
  id: string;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  imagePath?: string;
};

export default function AdminServicesPage() {
  const { t, dir } = useAdminI18n();
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title_en: "",
    title_ar: "",
    description_en: "",
    description_ar: "",
  });
  const [file, setFile] = useState<File | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/services");
    const data = (await res.json()) as { items?: ServiceItem[]; error?: string };
    if (res.ok) setItems(data.items ?? []);
    else setError(data.error ?? "Failed to load services");
    setLoading(false);
  }

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/services");
      const data = (await res.json()) as { items?: ServiceItem[]; error?: string };
      if (res.ok) setItems(data.items ?? []);
      else setError(data.error ?? "Failed to load services");
      setLoading(false);
    })();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.set(k, v));
    if (file) fd.set("image", file);

    const url = editingId ? `/api/services/${editingId}` : "/api/services";
    const method = editingId ? "PUT" : "POST";
    const res = await fetch(url, { method, body: fd });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(data.error ?? "Save failed");
      return;
    }
    setForm({ title_en: "", title_ar: "", description_en: "", description_ar: "" });
    setFile(null);
    setEditingId(null);
    await load();
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this service?")) return;
    const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
    if (res.ok) await load();
  }

  return (
    <AdminShell>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-extrabold tracking-tight">{t("services")}</h1>
        <p className="mt-2 text-sm text-slate-600">Add, edit, and delete multilingual services.</p>

        {error ? <p className="mt-3 text-sm font-semibold text-red-700">{error}</p> : null}

        <form onSubmit={submit} className="mt-6 grid gap-3 rounded-xl border border-slate-200 p-4">
          <input className="rounded-lg border px-3 py-2" placeholder="Title EN" value={form.title_en} onChange={(e) => setForm((p) => ({ ...p, title_en: e.target.value }))} required />
          <input className="rounded-lg border px-3 py-2" placeholder="Title AR" value={form.title_ar} onChange={(e) => setForm((p) => ({ ...p, title_ar: e.target.value }))} required dir="rtl" />
          <textarea className="rounded-lg border px-3 py-2" placeholder="Description EN" value={form.description_en} onChange={(e) => setForm((p) => ({ ...p, description_en: e.target.value }))} required />
          <textarea className="rounded-lg border px-3 py-2" placeholder="Description AR" value={form.description_ar} onChange={(e) => setForm((p) => ({ ...p, description_ar: e.target.value }))} required dir="rtl" />
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          <div className="flex gap-2">
            <button className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-bold text-white">{editingId ? "Update" : "Add"} Service</button>
            {editingId ? (
              <button type="button" className="rounded-lg border px-4 py-2 text-sm font-bold" onClick={() => { setEditingId(null); setForm({ title_en: "", title_ar: "", description_en: "", description_ar: "" }); }}>
                Cancel
              </button>
            ) : null}
          </div>
        </form>

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="px-3 py-2">Image</th>
                <th className="px-3 py-2">Title EN</th>
                <th className="px-3 py-2">Title AR</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="px-3 py-2">
                    {item.imagePath ? (
                      <Image src={item.imagePath} alt={item.title_en} width={64} height={48} className="h-12 w-16 rounded object-cover" />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-3 py-2">{item.title_en}</td>
                  <td className={["px-3 py-2", dir === "rtl" ? "text-right" : ""].join(" ")} dir="rtl">{item.title_ar}</td>
                  <td className="px-3 py-2 text-right">
                    <button className="mr-2 rounded border px-2 py-1 text-xs font-bold" onClick={() => { setEditingId(item.id); setForm({ title_en: item.title_en, title_ar: item.title_ar, description_en: item.description_en, description_ar: item.description_ar }); }}>
                      Edit
                    </button>
                    <button className="rounded border border-red-300 px-2 py-1 text-xs font-bold text-red-700" onClick={() => onDelete(item.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && items.length === 0 ? (
                <tr><td className="px-3 py-4 text-slate-500" colSpan={4}>No services yet.</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}

