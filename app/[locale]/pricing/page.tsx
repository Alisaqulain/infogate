import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/section";
import { TiltCard } from "@/components/tilt-card";
import { stock } from "@/lib/remote-images";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pricing",
  description: `Explore flexible ${SITE_NAME} plans for digital transformation, onboarding, automation, analytics, and integrated business growth.`,
};

export default async function PricingPage() {
  const t = await getTranslations();

  const tiers = [
    {
      name: t("pricing_tier1_name"),
      price: t("pricing_price_custom"),
      blurb: t("pricing_tier1_blurb"),
      items: [t("pricing_tier1_item1"), t("pricing_tier1_item2"), t("pricing_tier1_item3")],
      cta: t("pricing_tier1_cta"),
      featured: false,
    },
    {
      name: t("pricing_tier2_name"),
      price: t("pricing_price_custom"),
      blurb: t("pricing_tier2_blurb"),
      items: [
        t("pricing_tier2_item1"),
        t("pricing_tier2_item2"),
        t("pricing_tier2_item3"),
        t("pricing_tier2_item4"),
      ],
      cta: t("pricing_tier2_cta"),
      featured: true,
    },
    {
      name: t("pricing_tier3_name"),
      price: t("pricing_price_custom"),
      blurb: t("pricing_tier3_blurb"),
      items: [
        t("pricing_tier3_item1"),
        t("pricing_tier3_item2"),
        t("pricing_tier3_item3"),
        t("pricing_tier3_item4"),
      ],
      cta: t("pricing_tier3_cta"),
      featured: false,
    },
  ] as const;

  return (
    <>
      <Section innerClassName="pt-24 pb-16 md:pt-28 md:pb-22">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          {t("nav_pricing")}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
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
        <div className="grid gap-6 lg:grid-cols-3">
          {tiers.map((tier) => (
            <TiltCard key={tier.name} maxTiltDeg={8} className="h-full">
              <div
                className={
                  tier.featured
                    ? "relative h-full rounded-3xl border-2 border-cyan-400 bg-gradient-to-b from-white to-blue-50/80 p-8 shadow-2xl shadow-blue-500/20 transition hover:-translate-y-0.5"
                    : "h-full rounded-3xl border border-blue-100 bg-white/90 p-8 shadow-lg shadow-blue-500/10 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/15"
                }
              >
                {tier.featured ? (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-1 text-xs font-bold uppercase tracking-wide text-white">
                    {t("pricing_popular")}
                  </span>
                ) : null}
                <h2 className="text-xl font-extrabold text-slate-900">{tier.name}</h2>
                <p className="mt-2 text-3xl font-extrabold text-blue-700">{tier.price}</p>
                <p className="mt-2 text-sm text-slate-600">{tier.blurb}</p>
                <ul className="mt-6 space-y-3 text-sm font-medium text-slate-800">
                  {tier.items.map((i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-cyan-500">●</span>
                      {i}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className={
                    tier.featured
                      ? "fx-btn mt-8 flex w-full justify-center rounded-full bg-gradient-to-r from-blue-700 to-cyan-500 py-3 text-center text-sm font-bold text-white shadow-lg shadow-blue-600/25"
                      : "fx-btn mt-8 flex w-full justify-center rounded-full border-2 border-blue-200 py-3 text-center text-sm font-bold text-blue-900 hover:bg-blue-50"
                  }
                >
                  {tier.cta}
                </Link>
              </div>
            </TiltCard>
          ))}
        </div>
        <p className="mt-10 text-center text-sm text-slate-500">
          {t("pricing_note", { site: SITE_NAME })}
        </p>
      </Section>
    </>
  );
}

