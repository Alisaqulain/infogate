"use client";

import Link from "next/link";
import { useAdminI18n } from "@/components/admin/admin-i18n";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { lang, dir, setLang, t } = useAdminI18n();

  const items = [
    { href: "/admin", label: t("dashboard") },
    { href: "/admin/services", label: t("services") },
    { href: "/admin/pricing", label: t("pricing") },
    { href: "/admin/blog", label: t("blog") },
    { href: "/admin/forms", label: t("forms") },
  ] as const;

  return (
    <div dir={dir} className={cn("min-h-screen bg-slate-50 text-slate-900", lang === "ar" && "font-arabic")}>
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 md:grid-cols-[260px_1fr]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="text-lg font-extrabold">{t("admin")}</div>
            <div className="inline-flex overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              <button
                type="button"
                onClick={() => setLang("en")}
                className={cn(
                  "px-3 py-1.5 text-xs font-bold",
                  lang === "en" ? "bg-white text-slate-900" : "text-slate-600"
                )}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang("ar")}
                className={cn(
                  "px-3 py-1.5 text-xs font-bold",
                  lang === "ar" ? "bg-white text-slate-900" : "text-slate-600"
                )}
              >
                AR
              </button>
            </div>
          </div>

          <nav className="mt-4 grid gap-1">
            {items.map((it) => {
              const active = pathname === it.href;
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  className={cn(
                    "rounded-xl px-3 py-2 text-sm font-bold transition",
                    active ? "bg-blue-50 text-blue-800" : "text-slate-700 hover:bg-slate-50"
                  )}
                >
                  {it.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}

