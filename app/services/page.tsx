import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/section";
import { TiltCard } from "@/components/tilt-card";
import { stock } from "@/lib/remote-images";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description: `SEO, websites, and content services from ${SITE_NAME}.`,
};

const services = [
  {
    name: "SEO audits and roadmap",
    desc: "Crawl issues, indexation, Core Web Vitals, and a prioritized fix list with business impact in mind.",
    visual: stock.services.audit,
  },
  {
    name: "On-page and topical SEO",
    desc: "Titles, schema, internal linking, and entity-rich content plans aligned to how your customers search.",
    visual: stock.services.onPage,
  },
  {
    name: "Local and maps SEO",
    desc: "Profiles, reviews strategy, localized landing pages, and consistency across directories.",
    visual: stock.services.local,
  },
  {
    name: "Website design and dev",
    desc: "Marketing sites with strong UX, performance, and forms that send leads to your email pipeline.",
    visual: stock.services.webDev,
  },
  {
    name: "Analytics and tracking",
    desc: "GA4, Search Console, conversion events, so you know which pages earn revenue, not just clicks.",
    visual: stock.services.analytics,
  },
  {
    name: "Ongoing retainers",
    desc: "Monthly execution: content, links where appropriate, tests, and executive summaries.",
    visual: stock.services.retainer,
  },
];

export default function ServicesPage() {
  return (
    <>
      <Section innerClassName="pt-24 pb-16 md:pt-28 md:pb-22">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Services
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">
          Everything we offer ladders up to one outcome: your brand is easy to
          find, easy to trust, and easy to buy from. Mix and match what you need.
        </p>
      </Section>

      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          {services.map((s) => (
            <TiltCard key={s.name} maxTiltDeg={9} className="h-full">
              <article className="h-full overflow-hidden rounded-2xl border border-blue-100 bg-white/90 shadow-md shadow-blue-500/10 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/15">
                <Image
                  src={s.visual.src}
                  alt={s.visual.alt}
                  width={800}
                  height={400}
                  className="h-40 w-full object-cover"
                  sizes="(max-width:768px) 100vw, 50vw"
                />
                <div className="p-6">
                  <h2 className="text-xl font-bold text-slate-900">{s.name}</h2>
                  <p className="mt-2 text-slate-600">{s.desc}</p>
                </div>
              </article>
            </TiltCard>
          ))}
        </div>
        <div className="mt-12 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-8 text-center shadow-inner">
          <p className="text-lg font-bold text-slate-900">
            Not sure which service fits?
          </p>
          <p className="mt-2 text-slate-600">
            Tell us your site and goals. We will recommend a starting package.
          </p>
          <Link
            href="/contact"
            className="fx-btn mt-6 inline-flex rounded-full bg-gradient-to-r from-blue-700 to-cyan-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25"
          >
            Talk to {SITE_NAME}
          </Link>
        </div>
      </Section>
    </>
  );
}
