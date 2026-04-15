import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { LocaleHtml } from "@/components/locale-html";
import { FxScrollReveal } from "@/components/fx-scroll-reveal";
import { SiteShell } from "@/components/site-shell";
import { locales, type Locale } from "@/i18n/config";
import { SITE_NAME } from "@/lib/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const cairo = Cairo({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — SEO & growth websites`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "SEO strategy, local and organic growth, and websites built to convert. INFO GATE connects your brand to the right audience.",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();

  const messages = await getMessages();
  const fontVars = `${inter.variable} ${cairo.variable}`;

  return (
    <div className={`${fontVars} h-full antialiased`}>
      <NextIntlClientProvider messages={messages}>
        <LocaleHtml />
        <FxScrollReveal />
        <SiteShell>{children}</SiteShell>
      </NextIntlClientProvider>
    </div>
  );
}

