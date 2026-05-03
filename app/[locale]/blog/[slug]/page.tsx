import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/section";
import {
  DEMO_BLOG_DETAIL_BY_SLUG,
  DEMO_BLOG_SLUGS,
  type DemoBlogSlug,
} from "@/lib/demo-blog";
import { SHOW_BLOG } from "@/lib/features";
import type { Locale } from "@/i18n/config";
import { buildHreflangAlternates } from "@/lib/seo-metadata";

type Params = { locale: string; slug: string };

export function generateStaticParams() {
  return DEMO_BLOG_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale: locale as Locale });

  const path = `/blog/${slug}`;
  const alternates = await buildHreflangAlternates(locale, path);

  if (!SHOW_BLOG) {
    return {
      title: t("blog_hidden_title"),
      description: t("blog_hidden_body"),
      alternates,
    };
  }

  const post = DEMO_BLOG_DETAIL_BY_SLUG[slug as DemoBlogSlug];
  if (!post) {
    return {
      title: t("nav_blog"),
      alternates,
    };
  }

  return {
    title: t(post.titleKey),
    description: t(post.bodyKeys[0]),
    alternates,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  if (!SHOW_BLOG) {
    return (
      <>
        <Section innerClassName="pt-24 pb-10 md:pt-28 md:pb-14">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
            {t("blog_post_kicker")}
          </p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            {t("blog_hidden_title")}
          </h1>
        </Section>

        <Section>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-lg leading-relaxed text-slate-600">
              {t("blog_hidden_body")}
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/blog"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-slate-50"
              >
                {t("blog_post_back")}
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-700 to-cyan-500 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition hover:brightness-110"
              >
                {t("blog_back_home")}
              </Link>
            </div>
          </div>
        </Section>
      </>
    );
  }

  const post = DEMO_BLOG_DETAIL_BY_SLUG[slug as DemoBlogSlug];
  if (!post) notFound();

  return (
    <>
      <Section innerClassName="pt-24 pb-10 md:pt-28 md:pb-14">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
          {t("blog_post_kicker")}
        </p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          {t(post.titleKey)}
        </h1>
        <time
          className="mt-4 block text-sm font-semibold text-slate-600"
          dateTime={post.iso}
        >
          {t(post.dateKey)}
        </time>
      </Section>

      <Section>
        <div className="mx-auto max-w-3xl">
          <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white/90 shadow-lg shadow-blue-500/10">
            <div className="px-3 py-3 sm:px-4 sm:py-4">
              <Image
                src={post.cover.src}
                alt={post.cover.alt}
                width={1200}
                height={720}
                className="h-72 w-full rounded-xl bg-slate-100 object-contain object-center md:h-96"
                sizes="(max-width: 768px) 100vw, 768px"
                loading="lazy"
              />
            </div>
          </div>

          <div className="prose prose-slate mt-8 max-w-none">
            {post.bodyKeys.map((key) => (
              <p key={key}>{t(key)}</p>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/blog"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-slate-50"
            >
              {t("blog_post_back")}
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-700 to-cyan-500 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition hover:brightness-110"
            >
              {t("home_final_cta")}
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
