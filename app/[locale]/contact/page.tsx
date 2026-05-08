import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LeadForm } from "@/components/lead-form";
import { Section } from "@/components/section";
import { stock } from "@/lib/remote-images";
import { buildHreflangAlternates } from "@/lib/seo-metadata";
import { SITE_NAME } from "@/lib/site";
import { Mail, MapPin, Phone } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return {
    title: t("nav_contact"),
    description: t("contact_intro"),
    alternates: await buildHreflangAlternates(locale, "/contact"),
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <>
      <Section innerClassName="pt-24 pb-16 md:pt-28 md:pb-22">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          {t("nav_contact")}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">
          {t("contact_intro")}
        </p>
      </Section>

      <Section innerClassName="pb-24">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-start">
          <div className="relative order-2 overflow-hidden rounded-2xl border border-blue-100 shadow-xl shadow-blue-500/10 lg:order-1 lg:sticky lg:top-28">
            <Image
              src={stock.contactSide.src}
              alt={stock.contactSide.alt}
              width={900}
              height={1100}
              className="w-full h-auto object-cover object-center"
              sizes="(max-width:1024px) 100vw, 45vw"
              loading="lazy"
            />
            <div className="border-t border-blue-100 bg-white/95 px-5 py-4 text-sm text-slate-600 backdrop-blur-sm">
              {t("contact_email_hint")}
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <LeadForm
              heading={t("contact_form_heading", { site: SITE_NAME })}
              subheading={t("contact_form_subheading")}
            />
          </div>
        </div>
      </Section>

      <Section className="bg-gradient-to-b from-white to-blue-50/40">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              {t("contact_cards_title")}
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-blue-100 bg-white/90 p-5 shadow-sm backdrop-blur-sm">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <Mail className="h-4 w-4 text-blue-700" aria-hidden />
                  {t("contact_card_email")}
                </div>
                <p className="mt-2 text-sm text-slate-600">hello@infogate.om</p>
              </div>
              <div className="rounded-2xl border border-blue-100 bg-white/90 p-5 shadow-sm backdrop-blur-sm">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <Phone className="h-4 w-4 text-blue-700" aria-hidden />
                  {t("contact_card_phone")}
                </div>
                <p className="mt-2 text-sm text-slate-600">+968 9XX X XXX</p>
              </div>
              <div className="rounded-2xl border border-blue-100 bg-white/90 p-5 shadow-sm backdrop-blur-sm sm:col-span-2">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <MapPin className="h-4 w-4 text-blue-700" aria-hidden />
                  {t("contact_card_office")}
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  {t("contact_card_office_value")}
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white/90 shadow-sm">
            <div className="border-b border-blue-100 px-6 py-5">
              <h2 className="text-xl font-extrabold text-slate-900">
                {t("contact_map_title")}
              </h2>
              <p className="mt-1 text-sm text-slate-600">{t("contact_map_body")}</p>
            </div>
            <div className="relative aspect-[16/9] w-full bg-gradient-to-br from-slate-50 to-blue-50">
              <div className="absolute inset-0 grid place-items-center">
                <div className="rounded-2xl border border-blue-200/70 bg-white/70 px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur">
                  Map placeholder
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="deep">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
            {t("contact_faq_title")}
          </h2>
          <div className="mt-8 grid gap-4">
            {[
              { q: t("contact_faq_q1"), a: t("contact_faq_a1") },
              { q: t("contact_faq_q2"), a: t("contact_faq_a2") },
              { q: t("contact_faq_q3"), a: t("contact_faq_a3") },
            ].map((it) => (
              <div
                key={it.q}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
              >
                <p className="text-base font-extrabold text-white">{it.q}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  {it.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}

