"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { useAdminI18n } from "@/components/admin/admin-i18n";

export default function AdminHomePage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [stats, setStats] = useState({ services: 0, blogs: 0, inquiries: 0 });
  const { t, dir } = useAdminI18n();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/admin/me");
      if (!res.ok) {
        if (!cancelled) router.replace("/admin/login");
        return;
      }
      const data = (await res.json()) as { email?: string };
      if (!cancelled) setEmail(data.email ?? null);
      const statsRes = await fetch("/api/admin/stats");
      if (statsRes.ok) {
        const statsData = (await statsRes.json()) as {
          services?: number;
          blogs?: number;
          inquiries?: number;
        };
        if (!cancelled) {
          setStats({
            services: statsData.services ?? 0,
            blogs: statsData.blogs ?? 0,
            inquiries: statsData.inquiries ?? 0,
          });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  }

  return (
    <AdminShell>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              {t("dashboard")}
            </h1>
            <p className="text-sm text-slate-600">
              {email
                ? `${t("signedInAs")} ${email}`
                : t("checkingSession")}
            </p>
          </div>
          <button
            onClick={logout}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-800 hover:bg-slate-50"
          >
            {t("logout")}
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase text-slate-500">Total services</p>
          <p className="mt-2 text-3xl font-black">{stats.services}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase text-slate-500">Total blogs</p>
          <p className="mt-2 text-3xl font-black">{stats.blogs}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase text-slate-500">Total inquiries</p>
          <p className="mt-2 text-3xl font-black">{stats.inquiries}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { href: "/admin/services", title: t("services"), desc: t("addEditDeleteServices") },
          { href: "/admin/pricing", title: t("pricing"), desc: t("managePlans") },
          { href: "/admin/blog", title: t("blog"), desc: t("createPosts") },
          { href: "/admin/forms", title: t("forms"), desc: t("viewDeleteInquiries") },
        ].map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md"
          >
            <div className="text-lg font-extrabold">{c.title}</div>
            <div className={["mt-1 text-sm text-slate-600", dir === "rtl" ? "text-right" : ""].join(" ")}>
              {c.desc}
            </div>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}

