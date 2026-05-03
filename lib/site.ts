export const SITE_NAME = "InfoGate";

/** Public site URL for canonical tags, Open Graph, and JSON-LD. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://infogate.vercel.app";

/** Logo path used in header, favicon, and social previews. */
export const LOGO_SRC = "/logowithoutbginfo.png";

export const OG_IMAGE = LOGO_SRC;

export const SITE_KEYWORDS = [
  "InfoGate",
  "data platform",
  "digital transformation",
  "business registration",
  "analytics",
  "automation",
  "e-invoicing",
  "Oman",
  "social media marketing",
  "digital business card",
] as const;

export const navLinks = [
  { href: "/", key: "nav_home" },
  { href: "/about", key: "nav_about" },
  { href: "/services", key: "nav_services" },
  { href: "/pricing", key: "nav_pricing" },
  { href: "/blog", key: "nav_blog" },
  { href: "/contact", key: "nav_contact" },
] as const;
