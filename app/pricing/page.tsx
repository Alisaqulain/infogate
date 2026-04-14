import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/section";
import { TiltCard } from "@/components/tilt-card";
import { stock } from "@/lib/remote-images";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pricing",
  description: `SEO and website packages — flexible tiers from ${SITE_NAME}.`,
};

const tiers = [
  {
    name: "Starter",
    price: "Custom",
    blurb: "Best for new sites or one-off audits.",
    items: [
      "Technical & content SEO audit",
      "Top 10 quick-win fixes",
      "30-day action checklist",
    ],
    cta: "Request quote",
    featured: false,
  },
  {
    name: "Growth",
    price: "Custom",
    blurb: "For teams ready to publish and iterate monthly.",
    items: [
      "Everything in Starter",
      "Keyword map & content calendar",
      "On-page implementation support",
      "Monthly performance report",
    ],
    cta: "Get started",
    featured: true,
  },
  {
    name: "Website + SEO",
    price: "Custom",
    blurb: "New build with SEO baked in from day one.",
    items: [
      "Next.js marketing site",
      "Core SEO setup & redirects",
      "Lead form → your email",
      "Launch support",
    ],
    cta: "Plan my build",
    featured: false,
  },
];

export default function PricingPage() {
  return (
    <>
      <Section innerClassName="pt-24 pb-16 md:pt-28 md:pb-22">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Pricing
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">
          We don’t hide behind generic ₹/mo numbers on a page—every market and
          site is different. Use these tiers as a guide; we’ll confirm scope
          after a short call or form.
        </p>
        <div className="relative mt-10 aspect-[2/1] max-w-4xl overflow-hidden rounded-2xl border border-blue-100 shadow-xl shadow-blue-500/10">
          <Image
            src={stock.pricingHeader.src}
            alt={stock.pricingHeader.alt}
            fill
            className="object-cover"
            sizes="(max-width: 896px) 100vw, 896px"
          />
        </div>
      </Section>

      <Section>
        <div className="grid gap-6 lg:grid-cols-3">
          {tiers.map((t) => (
            <TiltCard key={t.name} maxTiltDeg={8} className="h-full">
              <div
                className={
                  t.featured
                    ? "relative h-full rounded-3xl border-2 border-cyan-400 bg-gradient-to-b from-white to-blue-50/80 p-8 shadow-2xl shadow-blue-500/20 transition hover:-translate-y-0.5"
                    : "h-full rounded-3xl border border-blue-100 bg-white/90 p-8 shadow-lg shadow-blue-500/10 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/15"
                }
              >
                {t.featured ? (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-1 text-xs font-bold uppercase tracking-wide text-white">
                    Popular
                  </span>
                ) : null}
                <h2 className="text-xl font-extrabold text-slate-900">{t.name}</h2>
                <p className="mt-2 text-3xl font-extrabold text-blue-700">
                  {t.price}
                </p>
                <p className="mt-2 text-sm text-slate-600">{t.blurb}</p>
                <ul className="mt-6 space-y-3 text-sm font-medium text-slate-800">
                  {t.items.map((i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-cyan-500">●</span>
                      {i}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className={
                    t.featured
                      ? "fx-btn mt-8 flex w-full justify-center rounded-full bg-gradient-to-r from-blue-700 to-cyan-500 py-3 text-center text-sm font-bold text-white shadow-lg shadow-blue-600/25"
                      : "fx-btn mt-8 flex w-full justify-center rounded-full border-2 border-blue-200 py-3 text-center text-sm font-bold text-blue-900 hover:bg-blue-50"
                  }
                >
                  {t.cta}
                </Link>
              </div>
            </TiltCard>
          ))}
        </div>
        <p className="mt-10 text-center text-sm text-slate-500">
          All quotes include timeline, deliverables, and what success looks like
          for {SITE_NAME} clients.
        </p>
      </Section>
    </>
  );
}
