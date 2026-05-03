"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { cn } from "@/lib/utils";

export function SiteShell({ children }: { children: ReactNode }) {
  usePathname();

  return (
    <>
      <a
        href="#main-content"
        className={cn(
          "sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100]",
          "focus:rounded-xl focus:bg-white focus:px-4 focus:py-3 focus:text-sm focus:font-semibold",
          "focus:text-slate-900 focus:shadow-lg focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-blue-600"
        )}
      >
        Skip to main content
      </a>
      <SiteHeader />
      <main
        id="main-content"
        tabIndex={-1}
        className={cn("flex-1 pt-0 outline-none")}
      >
        {children}
      </main>
      <SiteFooter />
    </>
  );
}

