"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { REGISTRATION_OSUS_LOGO_SRC } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Chamber / academy marks — larger; row scrolls on very narrow screens. */
const HERO_IMG_CLASS =
  "h-16 w-auto max-h-16 max-w-[38vw] object-contain object-center sm:h-[96px] sm:max-h-[96px] sm:max-w-[min(100%,280px)] md:h-[112px] md:max-h-[112px] md:max-w-[min(100%,320px)]";
const HERO_THIRD_LOGO_CLASS =
  "h-14 w-auto max-h-14 max-w-[34vw] object-contain object-center sm:h-[88px] sm:max-h-[88px] sm:max-w-[min(240px,48vw)] md:h-24 md:max-h-24 md:max-w-[min(280px,40vw)]";

/** Navy hero strip — aligns with header max-w-6xl content; full-width background. */
export function RegistrationHero() {
  const t = useTranslations();

  const subPrefix = t("reg_hero_sub_prefix");
  const subBrand = t("reg_hero_sub_brand");
  const showSubline = Boolean(subPrefix.trim() || subBrand.trim());

  return (
    <section
      className={cn(
        "relative w-full overflow-hidden border-b border-white/5 bg-[#0a192f]",
        /* Sit flush below fixed SiteHeader (~52px row + py + safe area); tighter than pt-20 to avoid extra strip */
        "pt-[calc(env(safe-area-inset-top,0px)+4.5rem)]"
      )}
      aria-label={t("reg_hero_program_title")}
    >
      {/* Soft wave + grid accents */}
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
        className="pointer-events-none absolute start-4 top-4 h-16 w-16 rounded-te-lg border-s border-t border-dotted border-sky-400/25"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-4 end-4 h-16 w-16 rounded-be-lg border-b border-e border-dotted border-sky-400/25"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-3 pb-6 pt-2 sm:px-6 sm:pb-8 sm:pt-3 md:pb-10 md:pt-4">
        <div className="rounded-2xl border border-sky-400/55 bg-[#0d2137]/95 px-4 py-5 shadow-[0_4px_24px_rgba(0,0,0,0.35)] backdrop-blur-[2px] md:px-8 md:py-6">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
            {/* Title block */}
            <div className="shrink-0 space-y-2 lg:max-w-[min(100%,280px)]">
              <p className="text-lg font-bold tracking-tight text-white md:text-xl">
                {t("reg_hero_program_title")}
              </p>
              {showSubline ? (
                <p className="text-sm text-white/90 md:text-base">
                  {subPrefix ? (
                    <>
                      {subPrefix}{" "}
                      <span className="font-semibold text-cyan-400">{subBrand}</span>
                    </>
                  ) : (
                    <span className="font-semibold text-cyan-400">{subBrand}</span>
                  )}
                </p>
              ) : null}
              {/* Accent line — sits tight under headline stack like reference */}
              <div className="h-0.5 w-12 rounded-full bg-cyan-400/90" aria-hidden />
            </div>

            {/* Partner logos — one horizontal row on all breakpoints (scroll on very narrow screens) */}
            <div className="flex min-w-0 flex-1 flex-row flex-nowrap items-center justify-center gap-2 overflow-x-auto overscroll-x-contain py-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-5 md:gap-7 [&::-webkit-scrollbar]:hidden">
              <div className="flex shrink-0 items-center justify-center rounded-lg bg-white px-2 py-1.5 shadow-sm shadow-black/10 sm:min-h-[96px] sm:px-4 sm:py-2.5 md:min-h-[112px]">
                <Image
                  src="/firsr.png"
                  alt={t("reg_hero_logo_chamber")}
                  width={360}
                  height={132}
                  className={HERO_IMG_CLASS}
                  sizes="(max-width: 640px) 38vw, 320px"
                />
              </div>
              <div className="h-12 w-px shrink-0 self-center bg-white/25 sm:h-16 md:h-20" aria-hidden />
              <div className="flex shrink-0 items-center justify-center rounded-lg bg-black px-2 py-1.5 shadow-sm shadow-black/10 sm:min-h-[96px] sm:px-4 sm:py-2.5 md:min-h-[112px]">
                <Image
                  src="/second.png"
                  alt={t("reg_hero_logo_academy")}
                  width={360}
                  height={132}
                  className={HERO_IMG_CLASS}
                  sizes="(max-width: 640px) 38vw, 320px"
                />
              </div>
              <div className="h-12 w-px shrink-0 self-center bg-white/25 sm:h-16 md:h-20" aria-hidden />
              <div className="flex shrink-0 items-center justify-center rounded-lg bg-white px-2 py-1.5 shadow-sm shadow-black/10 sm:min-h-[96px] sm:px-4 sm:py-2.5 md:min-h-[112px]">
                <Image
                  src={REGISTRATION_OSUS_LOGO_SRC}
                  alt={t("reg_hero_logo_osus")}
                  width={280}
                  height={112}
                  className={HERO_THIRD_LOGO_CLASS}
                  sizes="(max-width: 640px) 34vw, 280px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
