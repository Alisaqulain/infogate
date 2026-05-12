import type { MetadataRoute } from "next";
import { DEMO_BLOG_SLUGS } from "@/lib/demo-blog";
import { SHOW_BLOG } from "@/lib/features";
import { SITE_URL } from "@/lib/site";

const base = SITE_URL;
const locales = ["en", "ar"] as const;

const staticPaths = [
  "",
  "/about",
  "/services",
  "/pricing",
  ...(SHOW_BLOG ? ["/blog"] : []),
  "/contact",
  "/registration",
] as const;

const blogPostPaths = SHOW_BLOG
  ? DEMO_BLOG_SLUGS.map((slug) => `/blog/${slug}`)
  : [];

const paths = [...staticPaths, ...blogPostPaths];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${base}/${locale}${path}`,
      lastModified: now,
      changeFrequency:
        path === "" ? "weekly" : path.startsWith("/blog/") ? "monthly" : "monthly",
      priority:
        path === ""
          ? 1
          : path.startsWith("/blog/")
            ? 0.7
            : 0.8,
    }))
  );
}
