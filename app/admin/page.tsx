"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { useAdminI18n } from "@/components/admin/admin-i18n";

export default function AdminHomePage() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const { t } = useAdminI18n();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/admin/me");
      if (!res.ok) {
        if (!cancelled) router.replace("/admin/login");
        return;
      }
      const data = (await res.json()) as { username?: string };
      if (!cancelled) setUsername(data.username ?? null);
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
              {username
                ? `${t("signedInAs")} ${username}`
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

      {/* Osus count + shortcut cards hidden — use sidebar “Osus registrations” */}
      {/*
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-5 shadow-sm">
          <p className="text-xs font-bold uppercase text-blue-700">Osus registrations</p>
          <p className="mt-2 text-3xl font-black text-slate-900">{stats.registrations}</p>
        </div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/admin/forms" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md">
          <div className="text-lg font-extrabold">{t("forms")}</div>
          <div className="mt-1 text-sm text-slate-600">{t("osusRegistrationsDesc")}</div>
        </Link>
      </div>
      */}
    </AdminShell>
  );
}

