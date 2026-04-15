"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { useAdminI18n } from "@/components/admin/admin-i18n";

type PricingItem = {
  id: string;
  name_en: string;
  name_ar: string;
  price: string;
  features_en: string[];
  features_ar: string[];
  featured: boolean;
};

export default function AdminPricingPage() {
  const { t } = useAdminI18n();
  const [items, setItems] = useState<PricingItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name_en: "",
    name_ar: "",
    price: "",
    features_en: "",
    features_ar: "",
    featured: false,
  });

  async function load() {
    const res = await fetch("/api/pricing");
    const data = (await res.json()) as { items?: PricingItem[]; error?: string };
    if (res.ok) setItems(data.items ?? []);
    else setError(data.error ?? "Failed to load pricing");
  }
  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/pricing");
      const data = (await res.json()) as { items?: PricingItem[]; error?: string };
      if (res.ok) setItems(data.items ?? []);
      else setError(data.error ?? "Failed to load pricing");
    })();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const payload = {
      name_en: form.name_en,
      name_ar: form.name_ar,
      price: form.price,
      features_en: form.features_en.split("\n").map((x) => x.trim()).filter(Boolean),
      features_ar: form.features_ar.split("\n").map((x) => x.trim()).filter(Boolean),
      featured: form.featured,
    };
    const res = await fetch(editingId ? `/api/pricing/${editingId}` : "/api/pricing", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) return setError(data.error ?? "Save failed");
    setForm({ name_en: "", name_ar: "", price: "", features_en: "", features_ar: "", featured: false });
    setEditingId(null);
    await load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this plan?")) return;
    const res = await fetch(`/api/pricing/${id}`, { method: "DELETE" });
    if (res.ok) await load();
  }

  return (
    <AdminShell>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-extrabold tracking-tight">{t("pricing")}</h1>
        {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
        <form onSubmit={submit} className="mt-4 grid gap-3 rounded-xl border border-slate-200 p-4">
          <input className="rounded-lg border px-3 py-2" placeholder="Plan Name EN" value={form.name_en} onChange={(e) => setForm((p) => ({ ...p, name_en: e.target.value }))} required />
          <input className="rounded-lg border px-3 py-2" dir="rtl" placeholder="Plan Name AR" value={form.name_ar} onChange={(e) => setForm((p) => ({ ...p, name_ar: e.target.value }))} required />
          <input className="rounded-lg border px-3 py-2" placeholder="Price" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} required />
          <textarea className="rounded-lg border px-3 py-2" placeholder="Features EN (one per line)" value={form.features_en} onChange={(e) => setForm((p) => ({ ...p, features_en: e.target.value }))} />
          <textarea className="rounded-lg border px-3 py-2" dir="rtl" placeholder="Features AR (one per line)" value={form.features_ar} onChange={(e) => setForm((p) => ({ ...p, features_ar: e.target.value }))} />
          <label className="inline-flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={form.featured} onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))} /> Featured</label>
          <div className="flex gap-2">
            <button className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-bold text-white">{editingId ? "Update" : "Add"} Plan</button>
            {editingId ? <button type="button" className="rounded-lg border px-4 py-2 text-sm font-bold" onClick={() => { setEditingId(null); setForm({ name_en: "", name_ar: "", price: "", features_en: "", features_ar: "", featured: false }); }}>Cancel</button> : null}
          </div>
        </form>

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead><tr className="border-b text-left"><th className="px-3 py-2">Plan</th><th className="px-3 py-2">Price</th><th className="px-3 py-2">Featured</th><th className="px-3 py-2 text-right">Actions</th></tr></thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="px-3 py-2">{item.name_en}</td>
                  <td className="px-3 py-2">{item.price}</td>
                  <td className="px-3 py-2">{item.featured ? "Yes" : "No"}</td>
                  <td className="px-3 py-2 text-right">
                    <button className="mr-2 rounded border px-2 py-1 text-xs font-bold" onClick={() => { setEditingId(item.id); setForm({ name_en: item.name_en, name_ar: item.name_ar, price: item.price, features_en: item.features_en.join("\n"), features_ar: item.features_ar.join("\n"), featured: item.featured }); }}>Edit</button>
                    <button className="rounded border border-red-300 px-2 py-1 text-xs font-bold text-red-700" onClick={() => remove(item.id)}>Delete</button>
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

