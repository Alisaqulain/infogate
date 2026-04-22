import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  applicationName: "InfoGate",
  icons: {
    icon: [
      { url: "/WhatsApp Image 2026-04-13 at 6.30.02 PM.jpeg", type: "image/jpeg" },
      { url: "/updatelogo.jpeg", type: "image/jpeg" },
    ],
    shortcut: ["/updatelogo.jpeg"],
    apple: ["/updatelogo.jpeg"],
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
