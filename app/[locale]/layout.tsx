import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { LocaleHtml } from "@/components/locale-html";
import { FxScrollReveal } from "@/components/fx-scroll-reveal";
import { SiteShell } from "@/components/site-shell";
import { locales, type Locale } from "@/i18n/config";
import { SeoJsonLd } from "@/components/seo-json-ld";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { getRequestSiteUrl } from "@/lib/request-site";
import { OG_IMAGE, SITE_KEYWORDS, SITE_NAME } from "@/lib/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  adjustFontFallback: true,
});

const cairo = Cairo({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  adjustFontFallback: true,
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = await getRequestSiteUrl();
  const t = await getTranslations({ locale });
  const siteTitle = t("home_kicker");
  const siteDescription = t("home_intro");

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: siteTitle,
      template: `%s | ${SITE_NAME}`,
    },
    description: siteDescription,
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
      title: siteTitle,
      description: t("home_hero_tagline"),
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
      title: siteTitle,
      description: t("home_hero_tagline"),
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

  setRequestLocale(locale);

  const messages = await getMessages();
  const fontVars =
    locale === "ar"
      ? `${inter.variable} ${cairo.variable}`
      : inter.variable;
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <div className={`${fontVars} h-full antialiased`} dir={dir}>
      <SeoJsonLd locale={locale} />
      <ThemeProvider>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <LocaleHtml />
          <FxScrollReveal />
          <SiteShell>{children}</SiteShell>
        </NextIntlClientProvider>
      </ThemeProvider>
    </div>
  );
}

