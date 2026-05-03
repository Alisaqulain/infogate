import type { Metadata } from "next";
import { getRequestSiteUrl } from "@/lib/request-site";
import { SITE_URL } from "@/lib/site";

/**
 * Path after locale, e.g. "" for home, "/about", "/blog/post-slug".
 * Builds canonical and hreflang URLs for en / ar.
 */
export function hreflangAlternates(
  locale: string,
  pathWithoutLocale: string,
  baseUrl: string = SITE_URL
): Metadata["alternates"] {
  const suffix = pathWithoutLocale === "" ? "" : pathWithoutLocale;
  const en = `${baseUrl}/en${suffix}`;
  const ar = `${baseUrl}/ar${suffix}`;
  return {
    canonical: `${baseUrl}/${locale}${suffix}`,
    languages: {
      en,
      ar,
      "x-default": en,
    },
  };
}

/** Request-aware alternates for use inside generateMetadata. */
export async function buildHreflangAlternates(
  locale: string,
  pathWithoutLocale: string
): Promise<Metadata["alternates"]> {
  const base = await getRequestSiteUrl();
  return hreflangAlternates(locale, pathWithoutLocale, base);
}
