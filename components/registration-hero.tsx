"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import {
  REGISTRATION_ACADEMY_LOGO_SRC,
  REGISTRATION_CHAMBER_LOGO_SRC,
  REGISTRATION_OSUS_LOGO_SRC,
} from "@/lib/site";
import { cn } from "@/lib/utils";

const PARTNER_LOGO_CLASS =
  "h-16 w-auto max-h-16 max-w-[38vw] object-contain object-center sm:h-[96px] sm:max-h-[96px] sm:max-w-[min(100%,280px)] md:h-[112px] md:max-h-[112px] md:max-w-[min(100%,320px)]";
const OSUS_LOGO_CLASS =
  "h-20 w-auto max-h-20 max-w-[min(100%,360px)] object-contain object-center sm:h-28 sm:max-h-28 md:h-32 md:max-h-32";

function PartnerLogoBox({
  children,
  variant,
}: {
  children: ReactNode;
  variant: "light" | "dark";
}) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-lg px-2 py-1.5 shadow-sm shadow-black/10 sm:min-h-[96px] sm:px-4 sm:py-2.5 md:min-h-[112px]",
        variant === "light" ? "bg-white" : "bg-black"
      )}
    >
      {children}
    </div>
  );
}

function DaleelMark() {
  const t = useTranslations();
  return (
    <div className="flex flex-col items-center gap-1.5 px-3 py-2 text-center sm:px-4">
      <p className="text-sm font-semibold leading-snug text-slate-900 sm:text-base">
        {t("reg_hero_daleel_ar")}
      </p>
      <p className="font-serif text-[11px] font-medium uppercase tracking-[0.12em] text-[#1e4d8c] sm:text-xs">
        {t("reg_hero_daleel_en")}
      </p>
      <span
        className="mt-0.5 h-0.5 w-[min(100%,11rem)] rounded-full bg-[#1e4d8c]"
        aria-hidden
      />
    </div>
  );
}

/** Registration header — wireframe content on the original navy hero styling. */
export function RegistrationHero() {
  const t = useTranslations();
  const locale = useLocale();
  const isAr = locale === "ar";

  return (
    <section
      className={cn(
        "relative w-full overflow-hidden border-b border-white/5 bg-[#0a192f]",
        "pt-[calc(env(safe-area-inset-top,0px)+4.5rem)]"
      )}
      aria-label={t("reg_hero_program_title")}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 120% 80% at 50% -20%, rgba(56, 189, 248, 0.12), transparent 50%),
            radial-gradient(ellipse 80% 50% at 100% 50%, rgba(59, 130, 246, 0.08), transparent 45%),
            radial-gradient(ellipse 60% 40% at 0% 80%, rgba(34, 211, 238, 0.06), transparent 40%)
          `,
        }}
      />
      <div
        className="pointer-events-none absolute start-4 top-4 h-16 w-16 rounded-ts-lg border-s border-t border-dotted border-sky-400/25"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-4 end-4 h-16 w-16 rounded-be-lg border-b border-e border-dotted border-sky-400/25"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-3 pb-6 pt-2 sm:px-6 sm:pb-8 sm:pt-3 md:pb-10 md:pt-4">
        <div className="rounded-2xl border border-sky-400/55 bg-[#0d2137]/95 px-4 py-5 shadow-[0_4px_24px_rgba(0,0,0,0.35)] backdrop-blur-[2px] md:px-8 md:py-6">
          <div className="space-y-2 text-center">
            <p
              className={cn(
                "text-lg font-bold tracking-tight text-white md:text-xl",
                isAr && "font-arabic"
              )}
            >
              {t("reg_hero_program_title")}
            </p>
            <div
              className="mx-auto h-0.5 w-12 rounded-full bg-cyan-400/90"
              aria-hidden
            />
          </div>

          <div className="flex items-center justify-center px-2 py-6 sm:py-8 md:py-10">
            <Image
              src={REGISTRATION_OSUS_LOGO_SRC}
              alt={t("reg_hero_logo_osus")}
              width={420}
              height={168}
              className={OSUS_LOGO_CLASS}
              sizes="(max-width: 768px) 80vw, 360px"
              priority
            />
          </div>

          <div className="flex min-w-0 flex-row flex-nowrap items-center justify-center gap-2 overflow-x-auto overscroll-x-contain py-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-5 md:gap-7 [&::-webkit-scrollbar]:hidden">
            <PartnerLogoBox variant="dark">
              <Image
                src={REGISTRATION_ACADEMY_LOGO_SRC}
                alt={t("reg_hero_logo_academy")}
                width={360}
                height={132}
                className={PARTNER_LOGO_CLASS}
                sizes="(max-width: 640px) 38vw, 320px"
              />
            </PartnerLogoBox>
            <div
              className="h-12 w-px shrink-0 self-center bg-white/25 sm:h-16 md:h-20"
              aria-hidden
            />
            <PartnerLogoBox variant="light">
              <Image
                src={REGISTRATION_CHAMBER_LOGO_SRC}
                alt={t("reg_hero_logo_chamber")}
                width={360}
                height={132}
                className={PARTNER_LOGO_CLASS}
                sizes="(max-width: 640px) 38vw, 320px"
              />
            </PartnerLogoBox>
            <div
              className="h-12 w-px shrink-0 self-center bg-white/25 sm:h-16 md:h-20"
              aria-hidden
            />
            <PartnerLogoBox variant="light">
              <DaleelMark />
            </PartnerLogoBox>
          </div>
        </div>
      </div>
    </section>
  );
}
