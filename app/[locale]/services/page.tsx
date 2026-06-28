import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/section";
import { TiltCard } from "@/components/tilt-card";
import { stock } from "@/lib/remote-images";
import { buildHreflangAlternates } from "@/lib/seo-metadata";
import { REGISTRATION_PAGE_PATH, SITE_NAME } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return {
    title: t("nav_services"),
    description: t("services_intro"),
    alternates: await buildHreflangAlternates(locale, "/services"),
  };
}

const SURVEY_BULLETS = [
  "services_item1_b1",
  "services_item1_b2",
  "services_item1_b3",
  "services_item1_b4",
] as const;

const DIGITAL_CARD_BULLETS = [
  "services_item5_b1",
  "services_item5_b2",
  "services_item5_b3",
  "services_item5_b4",
  "services_item5_b5",
] as const;

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  /** Live product modules only (technology evaluation & transformation consulting omitted from this page). */
  const highLevel = [
    t("services_item1_name"),
    t("home_eco_2_title"),
    t("services_item5_name"),
    t("home_eco_3_title"),
    t("home_eco_4_title"),
  ] as const;

  const services = [
    {
      name: t("services_item1_name"),
      desc: t("services_item1_desc"),
      visual: stock.services.audit,
    },
    {
      name: t("services_item2_name"),
      desc: t("services_item2_desc"),
      visual: stock.services.onPage,
    },
    {
      name: t("services_item3_name"),
      desc: t("services_item3_desc"),
      visual: stock.services.eTicket,
    },
    {
      name: t("services_item4_name"),
      desc: t("services_item4_desc"),
      visual: stock.services.retainer,
    },
    {
      name: t("services_item5_name"),
      tagline: t("services_item5_tagline"),
      desc: t("services_item5_desc"),
      whyTitle: t("services_item5_why"),
      closing: t("services_item5_closing"),
      visual: stock.services.local,
    },
  ] as const;

  const talkToLabel = t("services_cta_button", { site: SITE_NAME });

  return (
    <>
      <Section innerClassName="pt-24 pb-16 md:pt-28 md:pb-22">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          {t("nav_services")}
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600">
          {t("services_intro")}
        </p>
        <ul className="mt-6 max-w-3xl space-y-2 text-slate-800">
          {highLevel.map((line) => (
            <li key={line} className="flex gap-2 font-medium">
              <span className="text-cyan-600">●</span>
              {line}
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <div className="space-y-10">
          {services.map((s, idx) => {
            const reverse = idx % 2 === 1;
            const isSurveyCompass = idx === 0;
            const isElectronicRegistration = idx === 1;
            const isDigitalBusinessCard = idx === 4;
            const ctaHref = isElectronicRegistration
              ? REGISTRATION_PAGE_PATH
              : "/contact";
            const ctaLabel = isElectronicRegistration
              ? t("services_registration_cta")
              : talkToLabel;
            const secondaryHref = isElectronicRegistration ? "/contact" : "/";
            const secondaryLabel = isElectronicRegistration
              ? talkToLabel
              : t("nav_home");
            return (
              <div
                key={s.name}
                className="grid items-center gap-8 rounded-3xl border border-blue-100 bg-white/80 p-6 shadow-xl shadow-blue-500/10 backdrop-blur-sm md:grid-cols-2 md:p-8"
              >
                <div className={reverse ? "md:order-2" : ""}>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                    {t("nav_services")}
                  </p>
                  <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                    {s.name}
                  </h2>
                  {"tagline" in s && s.tagline ? (
                    <p className="mt-2 text-base font-semibold leading-snug text-blue-800">
                      {s.tagline}
                    </p>
                  ) : null}
                  <p className="mt-4 text-base leading-relaxed text-slate-600">
                    {s.desc}
                  </p>
                  {isSurveyCompass ? (
                    <ul className="mt-5 max-w-xl space-y-2.5 text-base leading-snug text-slate-800">
                      {SURVEY_BULLETS.map((key) => (
                        <li key={key} className="flex gap-2.5">
                          <span
                            className="mt-0.5 shrink-0 font-bold text-emerald-600"
                            aria-hidden
                          >
                            ✓
                          </span>
                          <span>{t(key)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {isDigitalBusinessCard ? (
                    <>
                      <p className="mt-5 text-base font-bold text-slate-900">
                        {"whyTitle" in s ? s.whyTitle : null}
                      </p>
                      <ul className="mt-3 max-w-xl space-y-2.5 text-base leading-snug text-slate-800">
                        {DIGITAL_CARD_BULLETS.map((key) => (
                          <li key={key} className="flex gap-2.5">
                            <span
                              className="mt-0.5 shrink-0 font-bold text-emerald-600"
                              aria-hidden
                            >
                              ✓
                            </span>
                            <span>{t(key)}</span>
                          </li>
                        ))}
                      </ul>
                      {"closing" in s && s.closing ? (
                        <p className="mt-5 text-base leading-relaxed text-slate-700">
                          {s.closing}
                        </p>
                      ) : null}
                    </>
                  ) : null}
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      href={ctaHref}
                      className="fx-btn inline-flex rounded-full bg-gradient-to-r from-blue-700 to-cyan-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20"
                    >
                      {ctaLabel}
                    </Link>
                    <Link
                      href={secondaryHref}
                      className="inline-flex rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-900 shadow-sm transition hover:bg-slate-50"
                    >
                      {secondaryLabel}
                    </Link>
                  </div>
                </div>

                <div className={reverse ? "md:order-1" : ""}>
                  <TiltCard maxTiltDeg={8} className="h-full">
                    <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-md shadow-blue-500/10">
                      <div className="px-3 pt-3 sm:px-4 sm:pt-4">
                        <Image
                          src={s.visual.src}
                          alt={s.visual.alt}
                          width={900}
                          height={520}
                          className="h-60 w-full rounded-xl bg-slate-100 object-contain object-center sm:h-72"
                          sizes="(max-width:768px) 100vw, 50vw"
                          loading="lazy"
                        />
                      </div>
                      <div className="px-6 pb-6 pt-4 text-sm text-slate-600">
                        <span className="font-semibold text-slate-800">
                          Process:
                        </span>{" "}
                        Discover → Evaluate → Implement → Scale
                      </div>
                    </div>
                  </TiltCard>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-12 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-8 text-center shadow-inner">
          <p className="text-lg font-bold text-slate-900">
            {t("services_cta_title")}
          </p>
          <p className="mt-2 text-slate-600">{t("services_cta_body")}</p>
          <Link
            href="/contact"
            className="fx-btn mt-6 inline-flex rounded-full bg-gradient-to-r from-blue-700 to-cyan-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25"
          >
            {talkToLabel}
          </Link>
        </div>
      </Section>
    </>
  );
}
