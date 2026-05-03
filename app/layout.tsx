import "./globals.css";
import type { Metadata } from "next";
import { LOGO_SRC, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  applicationName: SITE_NAME,
  icons: {
    icon: [{ url: LOGO_SRC, type: "image/png", sizes: "any" }],
    shortcut: LOGO_SRC,
    apple: [{ url: LOGO_SRC, type: "image/png" }],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className="flex min-h-full flex-col bg-slate-50 text-slate-900 font-sans">
        {children}
      </body>
    </html>
  );
}
