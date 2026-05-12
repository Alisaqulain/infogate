"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { LOGO_SRC, SITE_NAME } from "@/lib/site";
import { cn } from "@/lib/utils";

const HERO_IMG_CLASS =
  "h-[72px] w-auto max-h-[72px] max-w-[min(100%,260px)] object-contain object-center md:h-[84px] md:max-h-[84px]";

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

            {/* Partner logos — firsr.png, second.png, same mark as header (transparent) */}
            <div className="flex min-w-0 flex-1 flex-col items-stretch gap-6 sm:flex-row sm:items-center sm:justify-center lg:justify-center">
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                <div className="flex min-h-[72px] items-center justify-center rounded-lg bg-white px-3 py-2 shadow-sm shadow-black/10 md:min-h-[84px]">
                  <Image
                    src="/firsr.png"
                    alt={t("reg_hero_logo_chamber")}
                    width={260}
                    height={96}
                    className={HERO_IMG_CLASS}
                    sizes="(max-width: 768px) 45vw, 260px"
                  />
                </div>
                <div className="hidden h-14 w-px shrink-0 bg-white/25 sm:block" aria-hidden />
                <div className="flex min-h-[72px] items-center justify-center rounded-lg bg-black px-3 py-2 shadow-sm shadow-black/10 md:min-h-[84px]">
                  <Image
                    src="/second.png"
                    alt={t("reg_hero_logo_academy")}
                    width={260}
                    height={96}
                    className={HERO_IMG_CLASS}
                    sizes="(max-width: 768px) 45vw, 260px"
                  />
                </div>
              </div>

              <div className="hidden h-14 w-px shrink-0 bg-white/25 lg:block" aria-hidden />

              {/* No white tile — same asset & sizing as SiteHeader so it blends on navy */}
              <div className="flex min-h-[72px] items-center justify-center px-2 md:min-h-[84px]">
                <Image
                  src={LOGO_SRC}
                  alt={`${SITE_NAME} logo`}
                  width={200}
                  height={80}
                  className="h-10 w-auto max-h-10 max-w-[min(200px,42vw)] object-contain object-center sm:h-11 sm:max-h-11 md:h-12 md:max-h-12"
                  sizes="(max-width: 640px) 150px, 200px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
