"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Magnetic } from "@/components/magnetic";
import { LOGO_SRC, navLinks, SITE_NAME } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";
  const rafId = useRef<number | null>(null);
  const last = useRef({ scrolled: false });

  // 👇 Scroll listener
  useEffect(() => {
    const setNext = (next: boolean) => {
      if (last.current.scrolled === next) return;
      last.current.scrolled = next;
      setScrolled(next);
    };

    // Hysteresis prevents flicker near the threshold.
    const ON_AT = 24; // becomes white after this
    const OFF_AT = 8; // becomes transparent only very near top

    const compute = () => {
      rafId.current = null;

      // On non-home pages, keep it white (more readable).
      if (!isHome) return setNext(true);
      // When mobile nav is open, keep it white.
      if (open) return setNext(true);

      const y = window.scrollY || 0;
      if (!last.current.scrolled) {
        setNext(y > ON_AT);
      } else {
        setNext(y > OFF_AT);
      }
    };

    const onScroll = () => {
      if (rafId.current != null) return;
      rafId.current = window.requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId.current != null) window.cancelAnimationFrame(rafId.current);
      rafId.current = null;
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ease-out",
        scrolled
          ? "border-b border-blue-100 bg-white/95 shadow-md shadow-blue-500/10 backdrop-blur-md"
          : "border-b border-transparent bg-transparent shadow-none backdrop-blur-none"
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
          onClick={() => setOpen(false)}
        >
          <Image
            src={LOGO_SRC}
            alt={`${SITE_NAME} logo`}
            width={120}
            height={48}
            className="h-auto w-[120px] object-contain sm:w-[60px]"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {navLinks.map(({ href, label }) => {
            const active =
              href === "/"
                ? pathname === "/"
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-semibold transition-colors",
                  active
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/25"
                    : scrolled
                    ? "text-slate-700 hover:bg-blue-50 hover:text-blue-800"
                    : "text-white hover:text-blue-200"
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Magnetic className="hidden sm:inline-block">
            <Link
              href="/contact"
              className="inline-flex rounded-full bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition hover:brightness-110"
            >
              Get SEO quote
            </Link>
          </Magnetic>

          <button
            type="button"
            className={cn(
              "inline-flex rounded-lg p-2 md:hidden",
              scrolled
                ? "border border-blue-200 text-slate-800"
                : "text-white border border-white/30"
            )}
            onClick={() => setOpen((v) => !v)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-blue-100 bg-white/95 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="rounded-lg px-3 py-2 text-base font-semibold text-slate-800 hover:bg-blue-50"
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="mt-2 rounded-full bg-gradient-to-r from-blue-700 to-cyan-500 py-3 text-center text-sm font-bold text-white"
              onClick={() => setOpen(false)}
            >
              Get SEO quote
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}