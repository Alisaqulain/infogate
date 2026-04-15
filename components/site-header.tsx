"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useEffect, useRef, useState } from "react";
import { Magnetic } from "@/components/magnetic";
import { LOGO_SRC, navLinks, SITE_NAME } from "@/lib/site";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/i18n/useTranslation";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const isHome = pathname === "/";
  const rafId = useRef<number | null>(null);
  const last = useRef({ scrolled: false });
  const langMenuRef = useRef<HTMLDivElement | null>(null);
  const locale = useLocale();
  const router = useRouter();
  const { t } = useTranslation();
  const isAr = locale === "ar";

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
  }, [isHome, open]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!langMenuRef.current) return;
      if (!(e.target instanceof Node)) return;
      if (!langMenuRef.current.contains(e.target)) setLangOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const solid = scrolled || !isHome || open;

  const setLocale = (nextLocale: "en" | "ar") => {
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ease-out",
        solid
          ? "border-b border-white/10 bg-slate-950/70 shadow-lg shadow-black/20 backdrop-blur-md"
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
          {navLinks.map(({ href, key }) => {
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
                    : solid
                    ? "text-slate-100/90 hover:bg-white/10 hover:text-white"
                    : "text-white hover:text-blue-200"
                )}
              >
                {t(key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="relative hidden md:block" ref={langMenuRef}>
            <button
              type="button"
              onClick={() => setLangOpen((v) => !v)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition",
                solid
                  ? "border border-white/15 bg-white/10 text-white hover:bg-white/15"
                  : "border border-white/25 bg-white/10 text-white hover:bg-white/15"
              )}
              aria-haspopup="menu"
              aria-expanded={langOpen}
            >
              <span className="text-xs font-bold tracking-wide">
                {isAr ? "AR" : "EN"}
              </span>
              <svg
                className="h-4 w-4 opacity-80"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {langOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-40 overflow-hidden rounded-xl border border-white/10 bg-slate-950/90 p-1 text-sm shadow-2xl shadow-black/30 backdrop-blur"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setLocale("en");
                    setLangOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left font-semibold transition",
                    !isAr
                      ? "bg-white/10 text-white"
                      : "text-slate-200 hover:bg-white/10"
                  )}
                >
                  English
                  {!isAr && <span className="text-xs opacity-70">✓</span>}
                </button>
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setLocale("ar");
                    setLangOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left font-semibold transition",
                    isAr
                      ? "bg-white/10 text-white"
                      : "text-slate-200 hover:bg-white/10"
                  )}
                >
                  العربية
                  {isAr && <span className="text-xs opacity-70">✓</span>}
                </button>
              </div>
            )}
          </div>

          <Magnetic className="hidden sm:inline-block">
            <Link
              href="/contact"
              className="inline-flex rounded-full bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition hover:brightness-110"
            >
              {t("nav_get_quote")}
            </Link>
          </Magnetic>

          <button
            type="button"
            className={cn(
              "inline-flex rounded-lg p-2 md:hidden",
              solid
                ? "border border-white/15 text-white bg-white/10"
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
        <div className="border-t border-white/10 bg-slate-950/90 px-4 py-4 text-slate-100 backdrop-blur md:hidden">
          <div className="flex flex-col gap-1">
            <div className="mb-2 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              <span className="text-sm font-semibold text-slate-100">
                {t("nav_language")}
              </span>
              <div className="inline-flex overflow-hidden rounded-full border border-white/10 bg-white/5">
                <button
                  type="button"
                  onClick={() => setLocale("en")}
                  className={cn(
                    "px-3 py-1.5 text-xs font-bold transition",
                    !isAr ? "bg-white/10 text-white" : "text-slate-300"
                  )}
                  aria-pressed={!isAr}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLocale("ar")}
                  className={cn(
                    "px-3 py-1.5 text-xs font-bold transition",
                    isAr ? "bg-white/10 text-white" : "text-slate-300"
                  )}
                  aria-pressed={isAr}
                >
                  AR
                </button>
              </div>
            </div>

            {navLinks.map(({ href, key }) => (
              <Link
                key={href}
                href={href}
                className="rounded-lg px-3 py-2 text-base font-semibold text-slate-100 hover:bg-white/10"
                onClick={() => setOpen(false)}
              >
                {t(key)}
              </Link>
            ))}
            <Link
              href="/contact"
              className="mt-2 rounded-full bg-gradient-to-r from-blue-700 to-cyan-500 py-3 text-center text-sm font-bold text-white"
              onClick={() => setOpen(false)}
            >
              {t("nav_get_quote")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}