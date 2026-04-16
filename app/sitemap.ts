import type { MetadataRoute } from "next";

const base = "https://infogate.vercel.app";
const locales = ["en", "ar"] as const;
const paths = ["", "/about", "/services", "/pricing", "/blog", "/contact"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${base}/${locale}${path}`,
      lastModified: now,
      changeFrequency: path === "" ? "weekly" : "monthly",
      priority: path === "" ? 1 : 0.8,
    }))
  );
}
