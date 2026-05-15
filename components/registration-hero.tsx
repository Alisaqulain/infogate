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
  "h-14 w-auto max-w-full object-contain object-center sm:h-[72px] md:h-20";
const OSUS_LOGO_CLASS =
  "h-20 w-auto max-w-[min(100%,360px)] object-contain object-center sm:h-28 md:h-32";

function PartnerCell({
  children,
  className,
  borderedEnd,
}: {
  children: ReactNode;
  className?: string;
  borderedEnd?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex min-h-[120px] items-center justify-center border-black p-4 sm:min-h-[140px] sm:p-5",
        "border-b last:border-b-0 sm:border-b-0",
        borderedEnd && "sm:border-e",
        className
      )}
    >
      {children}
    </div>
  );
}

function DaleelMark() {
  const t = useTranslations();
  return (
    <div className="flex flex-col items-center gap-1.5 px-2 text-center">
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

/** Registration header — Chamber of Commerce wireframe layout. */
export function RegistrationHero() {
  const t = useTranslations();
  const locale = useLocale();
  const isAr = locale === "ar";

  return (
    <section
      className={cn(
        "w-full border-b border-slate-200 bg-[#f0f4f8]",
        "pt-[calc(env(safe-area-inset-top,0px)+4.5rem)]"
      )}
      aria-label={t("reg_hero_program_title")}
    >
      <div className="mx-auto max-w-6xl px-3 pb-6 pt-2 sm:px-6 sm:pb-8 sm:pt-3 md:pb-10">
        <div className="overflow-hidden border border-black bg-white">
          {/* Title bar */}
          <div
            className={cn(
              "border-b border-black px-4 py-3 text-center text-sm font-medium text-slate-900 sm:text-base",
              isAr && "font-arabic"
            )}
          >
            {t("reg_hero_program_title")}
          </div>

          {/* Osus program mark */}
          <div className="flex items-center justify-center border-b border-black px-4 py-6 sm:py-8 md:py-10">
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

          {/* Partner logos — Academy | Chamber | Daleel */}
          <div className="grid grid-cols-1 sm:grid-cols-3">
            <PartnerCell borderedEnd>
              <Image
                src={REGISTRATION_ACADEMY_LOGO_SRC}
                alt={t("reg_hero_logo_academy")}
                width={320}
                height={120}
                className={PARTNER_LOGO_CLASS}
                sizes="(max-width: 640px) 70vw, 240px"
              />
            </PartnerCell>
            <PartnerCell borderedEnd>
              <Image
                src={REGISTRATION_CHAMBER_LOGO_SRC}
                alt={t("reg_hero_logo_chamber")}
                width={320}
                height={120}
                className={PARTNER_LOGO_CLASS}
                sizes="(max-width: 640px) 70vw, 240px"
              />
            </PartnerCell>
            <PartnerCell>
              <DaleelMark />
            </PartnerCell>
          </div>
        </div>
      </div>
    </section>
  );
}
