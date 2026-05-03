import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
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
  return {
    title: "Services",
    description: `${SITE_NAME} — technology evaluation, data management, digital transformation consulting, Oman Survey, registration, e-tickets, and electronic accounting.`,
    alternates: await buildHreflangAlternates(locale, "/services"),
  };
}

export default async function ServicesPage() {
  const t = await getTranslations();

  const highLevel = [
    t("services_high_1"),
    t("services_high_2"),
    t("services_high_3"),
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
  ] as const;

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
        <div className="grid gap-6 md:grid-cols-2">
          {services.map((s) => (
            <TiltCard key={s.name} maxTiltDeg={9} className="h-full">
              <article className="h-full overflow-hidden rounded-2xl border border-blue-100 bg-white/90 shadow-md shadow-blue-500/10 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/15">
                <div className="px-3 pt-3 sm:px-4 sm:pt-4">
                  <Image
                    src={s.visual.src}
                    alt={s.visual.alt}
                    width={800}
                    height={400}
                    className="h-56 w-full rounded-xl bg-slate-100 object-contain object-center sm:h-64"
                    sizes="(max-width:768px) 100vw, 50vw"
                    loading="lazy"
                  />
                </div>
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
            {t("services_cta_title")}
          </p>
          <p className="mt-2 text-slate-600">{t("services_cta_body")}</p>
          <Link
            href="/contact"
            className="fx-btn mt-6 inline-flex rounded-full bg-gradient-to-r from-blue-700 to-cyan-500 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25"
          >
            {t("services_cta_button", { site: SITE_NAME })}
          </Link>
        </div>
      </Section>
    </>
  );
}
