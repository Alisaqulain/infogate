"use client";

import type { SVGProps } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslation } from "@/i18n/useTranslation";
import { Magnetic } from "@/components/magnetic";
import { LOGO_SRC, navLinks, SITE_NAME, SOCIAL_LINKS } from "@/lib/site";

/** lucide-react 1.x does not ship Instagram/LinkedIn icons; inline SVGs avoid undefined components. */
function InstagramGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function LinkedInGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function SiteFooter() {
  const { t } = useTranslation();

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-slate-200">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
      >
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-blue-600/25 blur-3xl" />
        <svg
          className="absolute bottom-0 left-0 w-full text-white/10"
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M0,48 C240,8 480,88 720,40 C960,-8 1200,72 1440,32 L1440,80 L0,80 Z"
          />
        </svg>
      </div>
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Image
              src={LOGO_SRC}
              alt={`${SITE_NAME} logo`}
              width={160}
              height={64}
              className="h-auto w-[160px] max-w-full object-contain object-center brightness-110"
            />
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              {t("footer_tagline")}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-cyan-300/90">
              {t("footer_explore")}
            </p>
            <ul className="mt-3 flex flex-col gap-y-4 sm:grid sm:grid-cols-2 sm:gap-x-10 sm:gap-y-4">
              {navLinks.map(({ href, key }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="fx-link text-sm font-medium text-slate-300 hover:text-white"
                  >
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-cyan-300/90">
              {t("footer_start_project")}
            </p>
            <p className="mt-3 text-sm text-slate-400">
              {t("footer_start_project_body")}
            </p>
            <Magnetic strength={11} className="mt-4">
              <Link
                href="/contact"
                className="fx-btn inline-flex rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20"
              >
                {t("footer_contact_us")}
              </Link>
            </Magnetic>
          </div>
        </div>
        <div className="mt-12 border-t border-white/10 pt-8">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
              {[
                {
                  label: "Instagram",
                  Icon: InstagramGlyph,
                  href: SOCIAL_LINKS.instagram,
                },
                {
                  label: "LinkedIn",
                  Icon: LinkedInGlyph,
                  href: SOCIAL_LINKS.linkedin,
                },
              ].map(({ label, Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
                >
                  <Icon className="h-4 w-4" aria-hidden />
                </a>
              ))}
            </div>
            <p className="text-center text-xs text-slate-500">
              {t("footer_all_rights", {
                year: new Date().getFullYear(),
                site: SITE_NAME,
              })}
            </p>
          </div>

          <div className="mt-6 text-center text-xs leading-relaxed text-slate-400">
            <p className="mt-2">{t("footer_warning")}</p>
            <p className="mt-3 font-semibold text-slate-300">
              {t.rich("footer_credit", {
                fable: (chunks) => (
                  <a
                    href="https://www.scalefable.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-200 underline underline-offset-2 hover:text-white"
                  >
                    {chunks}
                  </a>
                ),
              })}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
