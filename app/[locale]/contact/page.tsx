import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { LeadForm } from "@/components/lead-form";
import { Section } from "@/components/section";
import { stock } from "@/lib/remote-images";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${SITE_NAME} for SEO and website projects. Submit the form and we’ll reply by email.`,
};

export default async function ContactPage() {
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
              className="h-64 w-full object-cover sm:h-80 lg:h-[min(520px,70vh)]"
              sizes="(max-width:1024px) 100vw, 45vw"
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
    </>
  );
}

