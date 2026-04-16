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
  metadataBase: new URL("https://infogate.vercel.app"),
  title: {
    default: `${SITE_NAME} | Data & Technology Ecosystem`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "InfoGate is a unified data and technology ecosystem helping organizations scale with smart registration, analytics, automation, digital business cards, social media marketing, and e-invoicing solutions.",
  openGraph: {
    title: `${SITE_NAME} | Data & Technology Ecosystem`,
    description:
      "Unified digital solutions for analytics, onboarding, automation, marketing, and financial operations.",
    siteName: SITE_NAME,
    images: [
      {
        url: "/WhatsApp Image 2026-04-16 at 13.39.27.jpeg",
        width: 1024,
        height: 768,
        alt: "InfoGate growth ecosystem illustration",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Data & Technology Ecosystem`,
    description:
      "Unified digital solutions for analytics, onboarding, automation, marketing, and financial operations.",
    images: ["/WhatsApp Image 2026-04-16 at 13.39.27.jpeg"],
  },
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

