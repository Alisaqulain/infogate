"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
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
  const { t } = useTranslation();
  const pathForLocale = pathname || "/";
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

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top,0px)] transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ease-out",
        solid
          ? "border-b border-white/10 bg-slate-950/70 shadow-lg shadow-black/20 backdrop-blur-md"
          : "border-b border-transparent bg-transparent shadow-none backdrop-blur-none"
      )}
    >
      <div className="mx-auto flex min-h-[3.25rem] max-w-6xl items-center justify-between gap-2 px-3 py-2 sm:min-h-0 sm:gap-4 sm:px-6 sm:py-3">
        <Link
          href="/"
          className="flex min-w-0 max-w-[46%] shrink-0 items-center gap-2 rounded-lg outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 sm:max-w-none sm:gap-3"
          onClick={() => setOpen(false)}
        >
          <Image
            src={LOGO_SRC}
            alt={`${SITE_NAME} logo`}
            width={200}
            height={80}
            className="h-10 w-auto max-h-10 max-w-[min(200px,42vw)] object-contain object-center sm:h-11 sm:max-h-11 md:h-12 md:max-h-12"
            priority
            sizes="(max-width: 640px) 150px, 200px"
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

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
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
                className="absolute end-0 mt-2 w-40 overflow-hidden rounded-xl border border-white/10 bg-slate-950/90 p-1 text-sm shadow-2xl shadow-black/30 backdrop-blur"
              >
                <Link
                  href={pathForLocale}
                  locale="en"
                  scroll={false}
                  role="menuitem"
                  onClick={() => setLangOpen(false)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-start font-semibold transition",
                    !isAr
                      ? "bg-white/10 text-white"
                      : "text-slate-200 hover:bg-white/10",
                  )}
                >
                  English
                  {!isAr && <span className="text-xs opacity-70">✓</span>}
                </Link>
                <Link
                  href={pathForLocale}
                  locale="ar"
                  scroll={false}
                  role="menuitem"
                  onClick={() => setLangOpen(false)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-start font-semibold transition",
                    isAr
                      ? "bg-white/10 text-white"
                      : "text-slate-200 hover:bg-white/10",
                  )}
                >
                  العربية
                  {isAr && <span className="text-xs opacity-70">✓</span>}
                </Link>
              </div>
            )}
          </div>

          <Magnetic className="inline-block shrink-0">
            <Link
              href="/contact"
              className="inline-flex max-w-[9.5rem] truncate rounded-full bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 px-2.5 py-1.5 text-[11px] font-bold leading-tight text-white shadow-lg shadow-blue-600/30 transition hover:brightness-110 sm:max-w-none sm:px-4 sm:py-2 sm:text-sm"
            >
              {t("nav_get_quote")}
            </Link>
          </Magnetic>

          <button
            type="button"
            className={cn(
              "inline-flex touch-manipulation rounded-lg p-2 md:hidden",
              "border border-white/15 bg-slate-950/60 text-white shadow-md shadow-black/20 backdrop-blur-md hover:bg-slate-950/75"
            )}
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <svg
              className="h-6 w-6 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.25}
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
        <div
          id="mobile-nav"
          className="max-h-[min(70vh,calc(100dvh-4rem))] overflow-y-auto overscroll-contain border-t border-white/10 bg-slate-950/95 px-4 py-4 text-slate-100 shadow-inner backdrop-blur-md md:hidden"
        >
          <div className="flex flex-col gap-1">
            <div className="mb-2 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2">
              <span className="text-sm font-semibold text-slate-100">
                {t("nav_language")}
              </span>
              <div className="inline-flex overflow-hidden rounded-full border border-white/10 bg-white/5">
                <Link
                  href={pathForLocale}
                  locale="en"
                  scroll={false}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-bold transition",
                    !isAr ? "bg-white/10 text-white" : "text-slate-300",
                  )}
                  aria-current={!isAr ? "true" : undefined}
                >
                  EN
                </Link>
                <Link
                  href={pathForLocale}
                  locale="ar"
                  scroll={false}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-bold transition",
                    isAr ? "bg-white/10 text-white" : "text-slate-300",
                  )}
                  aria-current={isAr ? "true" : undefined}
                >
                  AR
                </Link>
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