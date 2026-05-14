import { SHOW_BLOG, SHOW_PRICING } from "@/lib/features";

export const SITE_NAME = "InfoGate";

/** Public site URL for canonical tags, Open Graph, and JSON-LD. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://infogate.vercel.app";

/** Logo path used in header, favicon, and social previews. */
export const LOGO_SRC = "/logo-removebg-preview.png";

export const OG_IMAGE = LOGO_SRC;

/** Official social profiles (footer, etc.). */
export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/infogate_oman",
  linkedin: "https://www.linkedin.com/company/infogate-om",
} as const;

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

const allNavLinks = [
  { href: "/", key: "nav_home" },
  { href: "/about", key: "nav_about" },
  { href: "/services", key: "nav_services" },
  { href: "/pricing", key: "nav_pricing" },
  { href: "/blog", key: "nav_blog" },
  { href: "/contact", key: "nav_contact" },
] as const;

export type NavLink = (typeof allNavLinks)[number];

/**
 * Blog and pricing links are included only when the corresponding feature flags
 * in `@/lib/features` are `true`.
 *
 * Program registration (direct URL): `/en/registration/osus`, `/ar/registration/osus`.
 */
/** Public path (no locale prefix; next-intl adds `/en` or `/ar`). */
export const REGISTRATION_PAGE_PATH = "/registration/osus" as const;

/** Osus program mark — `public/third logo.jpeg` (encoded for URLs). */
export const REGISTRATION_OSUS_LOGO_SRC = "/third%20logo.jpeg" as const;

export const navLinks: readonly NavLink[] = allNavLinks.filter((link) => {
  if (link.href === "/blog" && !SHOW_BLOG) return false;
  if (link.href === "/pricing" && !SHOW_PRICING) return false;
  return true;
});
