import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { FxScrollReveal } from "@/components/fx-scroll-reveal";
import { SiteShell } from "@/components/site-shell";
import { SITE_NAME } from "@/lib/site";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — SEO & growth websites`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "SEO strategy, local and organic growth, and websites built to convert. INFO GATE connects your brand to the right audience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-slate-50 text-slate-900">
        <FxScrollReveal />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
