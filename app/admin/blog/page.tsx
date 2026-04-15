"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import slugify from "slugify";
import { type JSONContent } from "@tiptap/react";
import { AdminShell } from "@/components/admin/admin-shell";
import { useAdminI18n } from "@/components/admin/admin-i18n";
import { EMPTY_EDITOR_DOC, RichTextEditor } from "@/components/admin/rich-text-editor";

type BlogItem = {
  id: string;
  title_en: string;
  title_ar: string;
  slug: string;
  coverImagePath?: string;
  content_en: JSONContent;
  content_ar: JSONContent;
};

export default function AdminBlogPage() {
  const { t } = useAdminI18n();
  const [items, setItems] = useState<BlogItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [form, setForm] = useState({
    title_en: "",
    title_ar: "",
    slug: "",
    content_en: EMPTY_EDITOR_DOC as JSONContent,
    content_ar: EMPTY_EDITOR_DOC as JSONContent,
  });

  async function load() {
    const res = await fetch("/api/blogs");
    const data = (await res.json()) as { items?: BlogItem[]; error?: string };
    if (res.ok) setItems(data.items ?? []);
    else setError(data.error ?? "Failed to load blogs");
  }

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/blogs");
      const data = (await res.json()) as { items?: BlogItem[]; error?: string };
      if (res.ok) setItems(data.items ?? []);
      else setError(data.error ?? "Failed to load blogs");
    })();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const fd = new FormData();
    fd.set("title_en", form.title_en);
    fd.set("title_ar", form.title_ar);
    fd.set("slug", form.slug || slugify(form.title_en, { lower: true, strict: true }));
    fd.set("content_en", JSON.stringify(form.content_en));
    fd.set("content_ar", JSON.stringify(form.content_ar));
    if (coverImage) fd.set("coverImage", coverImage);

    const res = await fetch(editingId ? `/api/blogs/${editingId}` : "/api/blogs", {
      method: editingId ? "PUT" : "POST",
      body: fd,
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) return setError(data.error ?? "Save failed");

    setForm({
      title_en: "",
      title_ar: "",
      slug: "",
      content_en: EMPTY_EDITOR_DOC,
      content_ar: EMPTY_EDITOR_DOC,
    });
    setCoverImage(null);
    setEditingId(null);
    await load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this blog post?")) return;
    const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
    if (res.ok) await load();
  }

  return (
    <AdminShell>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-extrabold tracking-tight">{t("blog")}</h1>
        {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
        <form onSubmit={submit} className="mt-4 space-y-3 rounded-xl border border-slate-200 p-4">
          <input className="w-full rounded-lg border px-3 py-2" placeholder="Title EN" value={form.title_en} onChange={(e) => setForm((p) => ({ ...p, title_en: e.target.value, slug: slugify(e.target.value, { lower: true, strict: true }) }))} required />
          <input className="w-full rounded-lg border px-3 py-2" placeholder="Title AR" dir="rtl" value={form.title_ar} onChange={(e) => setForm((p) => ({ ...p, title_ar: e.target.value }))} required />
          <input className="w-full rounded-lg border px-3 py-2" placeholder="Slug" value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} required />
          <input type="file" accept="image/*" onChange={(e) => setCoverImage(e.target.files?.[0] ?? null)} />
          <RichTextEditor label="Content EN" value={form.content_en} onChange={(next) => setForm((p) => ({ ...p, content_en: next }))} />
          <RichTextEditor label="Content AR" value={form.content_ar} onChange={(next) => setForm((p) => ({ ...p, content_ar: next }))} />
          <div className="flex gap-2">
            <button className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-bold text-white">{editingId ? "Update" : "Add"} Blog</button>
            {editingId ? <button type="button" className="rounded-lg border px-4 py-2 text-sm font-bold" onClick={() => { setEditingId(null); setForm({ title_en: "", title_ar: "", slug: "", content_en: EMPTY_EDITOR_DOC, content_ar: EMPTY_EDITOR_DOC }); }}>Cancel</button> : null}
          </div>
        </form>

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead><tr className="border-b text-left"><th className="px-3 py-2">Cover</th><th className="px-3 py-2">Title EN</th><th className="px-3 py-2">Slug</th><th className="px-3 py-2 text-right">Actions</th></tr></thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="px-3 py-2">
                    {item.coverImagePath ? (
                      <Image src={item.coverImagePath} alt={item.title_en} width={64} height={48} className="h-12 w-16 rounded object-cover" />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-3 py-2">{item.title_en}</td>
                  <td className="px-3 py-2">{item.slug}</td>
                  <td className="px-3 py-2 text-right">
                    <button className="mr-2 rounded border px-2 py-1 text-xs font-bold" onClick={() => { setEditingId(item.id); setForm({ title_en: item.title_en, title_ar: item.title_ar, slug: item.slug, content_en: item.content_en || EMPTY_EDITOR_DOC, content_ar: item.content_ar || EMPTY_EDITOR_DOC }); }}>Edit</button>
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

