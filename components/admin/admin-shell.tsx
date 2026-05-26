"use client";

import Link from "next/link";
import { useAdminI18n } from "@/components/admin/admin-i18n";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useAdminI18n();

  const items = [
    { href: "/admin", label: t("dashboard") },
    // { href: "/admin/services", label: t("services") },
    // { href: "/admin/pricing", label: t("pricing") },
    // { href: "/admin/blog", label: t("blog") },
    { href: "/admin/forms", label: t("forms") },
  ] as const;

  return (
    <div dir="ltr" className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto grid w-full max-w-[min(100%,90rem)] gap-4 px-3 py-4 sm:gap-6 sm:px-4 sm:py-6 md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-lg font-extrabold">{t("admin")}</div>

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

