import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { LocaleHtml } from "@/components/locale-html";
import { FxScrollReveal } from "@/components/fx-scroll-reveal";
import { SiteShell } from "@/components/site-shell";
import { locales, type Locale } from "@/i18n/config";
import { SeoJsonLd } from "@/components/seo-json-ld";
import { getRequestSiteUrl } from "@/lib/request-site";
import { OG_IMAGE, SITE_KEYWORDS, SITE_NAME } from "@/lib/site";

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = await getRequestSiteUrl();

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: `${SITE_NAME}: The Gateway to Data & Technology`,
      template: `%s | ${SITE_NAME}`,
    },
    description:
      "InfoGate is the gateway to data and technology — a unified AI-powered platform for registration, analytics, automation, digital business cards, social media marketing, and e-invoicing.",
    keywords: [...SITE_KEYWORDS],
    authors: [{ name: SITE_NAME, url: baseUrl }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    formatDetection: { email: false, address: false, telephone: false },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    openGraph: {
      title: `${SITE_NAME}: The Gateway to Data & Technology`,
      description:
        "Build your business with passion. Run it smarter with InfoGate — unified visibility, smart decisions, and seamless digital transformation.",
      siteName: SITE_NAME,
      locale: locale === "ar" ? "ar_SA" : "en_US",
      alternateLocale: locale === "ar" ? ["en_US"] : ["ar_SA"],
      images: [
        {
          url: OG_IMAGE,
          alt: `${SITE_NAME} — data and technology ecosystem`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${SITE_NAME}: The Gateway to Data & Technology`,
      description:
        "Build your business with passion. Run it smarter with InfoGate — unified visibility, smart decisions, and seamless digital transformation.",
      images: [OG_IMAGE],
    },
  };
}

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
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <div className={`${fontVars} h-full antialiased`} dir={dir}>
      <SeoJsonLd locale={locale} />
      <NextIntlClientProvider locale={locale} messages={messages}>
        <LocaleHtml />
        <FxScrollReveal />
        <SiteShell>{children}</SiteShell>
      </NextIntlClientProvider>
    </div>
  );
}

