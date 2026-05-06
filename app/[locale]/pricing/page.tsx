import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/section";
import { TiltCard } from "@/components/tilt-card";
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
    title: t("nav_pricing"),
    description: t("pricing_intro"),
    alternates: await buildHreflangAlternates(locale, "/pricing"),
  };
}

type Pkg = {
  titleKey: string;
  priceKey: string;
  priceNoteKey?: string;
  bestKey?: string;
  itemKeys: string[];
  noteKey?: string;
  featured?: boolean;
};

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const omanSurvey: Pkg[] = [
    {
      titleKey: "pricing_oman_free_title",
      priceKey: "pricing_oman_free_price",
      itemKeys: [
        "pricing_oman_free_i1",
        "pricing_oman_free_i2",
        "pricing_oman_free_i3",
      ],
      bestKey: "pricing_oman_free_best",
    },
    {
      titleKey: "pricing_oman_p1_title",
      priceKey: "pricing_oman_p1_price",
      priceNoteKey: "pricing_oman_p1_price_note",
      itemKeys: [
        "pricing_oman_p1_i1",
        "pricing_oman_p1_i2",
        "pricing_oman_p1_i3",
        "pricing_oman_p1_i4",
        "pricing_oman_p1_i5",
        "pricing_oman_p1_i6",
        "pricing_oman_p1_i7",
      ],
      bestKey: "pricing_oman_p1_best",
      noteKey: "pricing_oman_p1_value",
      featured: true,
    },
    {
      titleKey: "pricing_oman_pm_title",
      priceKey: "pricing_oman_pm_price",
      priceNoteKey: "pricing_oman_pm_price_note",
      itemKeys: [
        "pricing_oman_pm_i1",
        "pricing_oman_pm_i2",
        "pricing_oman_pm_i3",
        "pricing_oman_pm_i4",
        "pricing_oman_pm_i5",
        "pricing_oman_pm_i6",
        "pricing_oman_pm_i7",
        "pricing_oman_pm_i8",
        "pricing_oman_pm_i9",
      ],
      bestKey: "pricing_oman_pm_best",
    },
  ];

  const registration: Pkg[] = [
    {
      titleKey: "pricing_reg_p1_title",
      priceKey: "pricing_reg_p1_price",
      priceNoteKey: "pricing_reg_p1_price_note",
      itemKeys: [
        "pricing_reg_p1_i1",
        "pricing_reg_p1_i2",
        "pricing_reg_p1_i3",
        "pricing_reg_p1_i4",
        "pricing_reg_p1_i5",
      ],
      bestKey: "pricing_reg_p1_ideal",
      featured: true,
    },
    {
      titleKey: "pricing_reg_pm_title",
      priceKey: "pricing_reg_pm_price",
      priceNoteKey: "pricing_reg_pm_price_note",
      itemKeys: [
        "pricing_reg_pm_i1",
        "pricing_reg_pm_i2",
        "pricing_reg_pm_i3",
        "pricing_reg_pm_i4",
        "pricing_reg_pm_i5",
        "pricing_reg_pm_i6",
      ],
    },
  ];

  function PackageCard({ pkg }: { pkg: Pkg }) {
    return (
      <TiltCard maxTiltDeg={7} className="h-full">
        <div
          className={
            pkg.featured
              ? "relative h-full rounded-3xl border-2 border-cyan-400 bg-gradient-to-b from-white to-blue-50/80 p-6 shadow-2xl shadow-blue-500/15 sm:p-8"
              : "h-full rounded-3xl border border-blue-100 bg-white/90 p-6 shadow-lg shadow-blue-500/10 sm:p-8"
          }
        >
          {pkg.featured ? (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white sm:text-xs">
              {t("pricing_popular")}
            </span>
          ) : null}
          <h3 className="text-lg font-extrabold text-slate-900">
            {t(pkg.titleKey)}
          </h3>
          <p className="mt-2 text-2xl font-extrabold text-blue-700">
            {t(pkg.priceKey)}
          </p>
          {pkg.priceNoteKey ? (
            <p className="text-sm font-semibold text-slate-600">
              {t(pkg.priceNoteKey)}
            </p>
          ) : null}
          {pkg.bestKey ? (
            <p className="mt-3 text-sm font-bold text-slate-800">
              {t(pkg.bestKey)}
            </p>
          ) : null}
          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-blue-600">
            {t("pricing_includes_label")}
          </p>
          <ul className="mt-2 space-y-2 text-sm text-slate-700">
            {pkg.itemKeys.map((k) => (
              <li key={k} className="flex gap-2">
                <span className="text-cyan-500">●</span>
                <span>{t(k)}</span>
              </li>
            ))}
          </ul>
          {pkg.noteKey ? (
            <p className="mt-4 rounded-xl bg-blue-50/80 p-3 text-sm font-medium text-slate-800">
              {t(pkg.noteKey)}
            </p>
          ) : null}
          <Link
            href="/contact"
            className="fx-btn mt-6 flex w-full justify-center rounded-full bg-gradient-to-r from-blue-700 to-cyan-500 py-3 text-center text-sm font-bold text-white shadow-md shadow-blue-600/20"
          >
            {t("pricing_pkg_cta")}
          </Link>
        </div>
      </TiltCard>
    );
  }

  return (
    <>
      <Section innerClassName="pt-24 pb-16 md:pt-28 md:pb-22">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          {t("nav_pricing")}
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600">
          {t("pricing_intro")}
        </p>
        <div className="relative mt-10 aspect-[2/1] max-w-4xl overflow-hidden rounded-2xl border border-blue-100 shadow-xl shadow-blue-500/10">
          <Image
            src={stock.pricingHeader.src}
            alt={stock.pricingHeader.alt}
            fill
            className="object-cover object-center"
            sizes="(max-width: 896px) 100vw, 896px"
          />
        </div>
      </Section>

      <Section>
        <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
          {t("pricing_oman_heading")}
        </h2>
        <p className="mt-2 max-w-3xl text-slate-600">{t("pricing_oman_intro")}</p>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {omanSurvey.map((pkg) => (
            <PackageCard key={pkg.titleKey} pkg={pkg} />
          ))}
        </div>
      </Section>

      <Section tone="deep" innerClassName="py-16 md:py-20">
        <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
          {t("pricing_reg_heading")}
        </h2>
        <p className="mt-2 max-w-3xl text-slate-300">{t("pricing_reg_intro")}</p>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {registration.map((pkg) => (
            <PackageCard key={pkg.titleKey} pkg={pkg} />
          ))}
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-3xl rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-8 text-center shadow-inner">
          <h2 className="text-xl font-extrabold text-slate-900">
            {t("pricing_more_title")}
          </h2>
          <p className="mt-3 text-slate-700">{t("pricing_more_body")}</p>
          <Link
            href="/contact"
            className="fx-btn mt-6 inline-flex rounded-full bg-gradient-to-r from-blue-700 to-cyan-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25"
          >
            {t("pricing_more_cta")}
          </Link>
        </div>
        <p className="mt-10 text-center text-sm text-slate-500">
          {t("pricing_note", { site: SITE_NAME })}
        </p>
      </Section>
    </>
  );
}
