"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(pathname === "/admin/login");

  useEffect(() => {
    if (pathname === "/admin/login") {
      return;
    }
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/admin/me");
      if (!res.ok) {
        if (!cancelled) router.replace("/admin/login");
        return;
      }
      if (!cancelled) setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  if (!ready) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-slate-600">Checking session...</div>;
  }
  return <>{children}</>;
}
