import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProgramRegistrationForm } from "@/components/program-registration-form";
import { RegistrationHero } from "@/components/registration-hero";
import { buildHreflangAlternates } from "@/lib/seo-metadata";
import { REGISTRATION_PAGE_PATH } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return {
    title: t("nav_registration"),
    description: t("reg_meta_description"),
    alternates: await buildHreflangAlternates(locale, REGISTRATION_PAGE_PATH),
  };
}

export default async function RegistrationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      <RegistrationHero />
      <ProgramRegistrationForm />
    </div>
  );
}
