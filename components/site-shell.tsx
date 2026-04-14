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
      <SiteHeader />
      <main className={cn("flex-1 pt-0")}>{children}</main>
      <SiteFooter />
    </>
  );
}

