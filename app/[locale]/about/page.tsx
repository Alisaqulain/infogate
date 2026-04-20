import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/section";
import { stock } from "@/lib/remote-images";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `Learn how ${SITE_NAME} helps organizations adopt smarter digital tools for data, automation, onboarding, marketing, and sustainable growth.`,
};

export default async function AboutPage() {
  const t = await getTranslations();

  const bullets = [
    t("about_bullet1"),
    t("about_bullet2"),
    t("about_bullet3"),
    t("about_bullet4"),
  ] as const;

  return (
    <>
      <Section innerClassName="pt-24 pb-16 md:pt-28 md:pb-22">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
          {t("about_kicker")}
        </p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          {t("about_title")}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-600">
          {t("about_intro", { site: SITE_NAME })}
        </p>
        <div className="relative mt-10 aspect-[21/9] max-w-4xl overflow-hidden rounded-2xl border border-blue-100 shadow-xl shadow-blue-500/10">
          <Image
            src={stock.aboutTeam.src}
            alt={stock.aboutTeam.alt}
            fill
            className="object-cover object-center"
            sizes="(max-width: 896px) 100vw, 896px"
            priority
          />
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {t("about_how_title")}
            </h2>
            <p className="mt-4 text-slate-600">{t("about_how_p1")}</p>
            <p className="mt-4 text-slate-600">{t("about_how_p2")}</p>
          </div>
          <ul className="space-y-4 rounded-2xl border border-blue-100 bg-white/90 p-6 shadow-lg shadow-blue-500/10">
            {bullets.map((line) => (
              <li
                key={line}
                className="flex gap-3 text-sm font-semibold text-slate-800"
              >
                <span
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-xs text-white"
                  aria-hidden
                >
                  ✓
                </span>
                {line}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section tone="deep" innerClassName="py-16 md:py-20">
        <div className="relative mx-auto mb-10 aspect-[2/1] max-w-3xl overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/30">
          <Image
            src="/WhatsApp Image 2026-04-16 at 13.39.27 (2).jpeg"
            alt="InfoGate workflow automation illustration"
            fill
            className="object-center  opacity-90"
            sizes="(max-width: 768px) 100vw, 768px"
          />
          {/* <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" /> */}
        </div>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
            {t("about_cta_title")}
          </h2>
          <p className="mt-3 text-slate-300">{t("about_cta_body")}</p>
          <Link
            href="/contact"
            className="mt-8 inline-flex rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-8 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/25"
          >
            {t("about_cta_button", { site: SITE_NAME })}
          </Link>
        </div>
      </Section>
    </>
  );
}

