import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/section";
import { stock } from "@/lib/remote-images";
import { buildHreflangAlternates } from "@/lib/seo-metadata";
import { SITE_NAME } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return {
    title: t("nav_about"),
    description: t("about_intro"),
    alternates: await buildHreflangAlternates(locale, "/about"),
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const bullets = [
    t("about_bullet1"),
    t("about_bullet2"),
    t("about_bullet3"),
  ] as const;

  return (
    <>
      <Section
        innerClassName="pt-24 pb-16 md:pt-28 md:pb-24"
        className="bg-gradient-to-b from-slate-50 via-white to-blue-50/30"
      >
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
          {t("about_kicker")}
        </p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          {t("about_title")}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-600">
          {t("about_intro")}
        </p>

        <div className="mt-10 grid items-stretch gap-10 lg:grid-cols-2 lg:gap-12 lg:items-start">
          <div className="relative order-2 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-xl shadow-blue-500/10 lg:order-1">
            <div className="px-3 py-3 sm:px-4 sm:py-4">
              <Image
                src={stock.aboutTeam.src}
                alt={stock.aboutTeam.alt}
                width={1280}
                height={720}
                className="h-64 w-full rounded-xl bg-slate-100 object-contain object-center sm:h-72 md:h-80"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </div>

          <div className="order-1 flex flex-col lg:order-2">
            <ul className="space-y-4 rounded-2xl border border-blue-100 bg-white/95 p-6 shadow-lg shadow-blue-500/10 backdrop-blur-sm">
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
            <p className="mt-8 text-lg leading-relaxed text-slate-600">
              {t("about_integration")}
            </p>
          </div>
        </div>
      </Section>

      <Section
        className="bg-gradient-to-b from-blue-50/40 to-white"
        innerClassName="py-16 md:py-20"
      >
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
              {t("home_vision_mission_title")}
            </h2>
            <div className="mt-8 space-y-4">
              <div className="rounded-2xl border border-blue-200/80 bg-gradient-to-br from-white to-sky-50/60 p-5 shadow-sm">
                <p className="text-lg leading-relaxed text-slate-700">
                  <span className="font-extrabold text-slate-900">
                    {t("home_stat_focus")}:
                  </span>{" "}
                  {t("home_stat_focus_value")}
                </p>
              </div>
              <div className="rounded-2xl border border-blue-200/80 bg-gradient-to-br from-white to-sky-50/60 p-5 shadow-sm">
                <p className="text-lg leading-relaxed text-slate-700">
                  <span className="font-extrabold text-slate-900">
                    {t("home_stat_delivery")}:
                  </span>{" "}
                  {t("home_stat_delivery_value")}
                </p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-xl shadow-blue-500/10">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={stock.heroSide.src}
                  alt={stock.heroSide.alt}
                  fill
                  className="object-contain object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="deep" innerClassName="py-16 md:py-20">
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
