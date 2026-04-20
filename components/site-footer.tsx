"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useTranslation } from "@/i18n/useTranslation";
import { Magnetic } from "@/components/magnetic";
import { LOGO_SRC, navLinks, SITE_NAME } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteFooter() {
  const locale = useLocale();
  const { t } = useTranslation();
  const isAr = locale === "ar";

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
              className="h-auto w-[160px] object-contain brightness-110"
            />
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              {t("footer_tagline")}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-cyan-300/90">
              {t("footer_explore")}
            </p>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
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
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div
              className={cn(
                "text-center text-xs text-slate-500",
                isAr ? "sm:text-left" : "sm:text-right"
              )}
            >
              {t("footer_all_rights", {
                year: new Date().getFullYear(),
                site: SITE_NAME,
              })}
            </div>
          </div>

          <div
            className={[
              "mt-6 text-xs leading-relaxed text-slate-400",
              isAr ? "text-right" : "text-center",
            ].join(" ")}
          >
            <p className="mt-2">{t("footer_warning")}</p>
            <p className="mt-3 font-semibold text-slate-300">{t("footer_credit")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
