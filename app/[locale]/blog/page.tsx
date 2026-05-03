import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/section";
import { TiltCard } from "@/components/tilt-card";
import { DEMO_BLOG_LIST } from "@/lib/demo-blog";
import { SHOW_BLOG } from "@/lib/features";
import type { Locale } from "@/i18n/config";
import { buildHreflangAlternates } from "@/lib/seo-metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale });
  const alternates = await buildHreflangAlternates(locale, "/blog");
  if (!SHOW_BLOG) {
    return {
      title: t("blog_hidden_title"),
      description: t("blog_hidden_body"),
      alternates,
    };
  }
  return {
    title: t("nav_blog"),
    description: t("blog_intro"),
    alternates,
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  if (!SHOW_BLOG) {
    return (
      <>
        <Section innerClassName="pt-24 pb-16 md:pt-28 md:pb-22">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            {t("blog_hidden_title")}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
            {t("blog_hidden_body")}
          </p>
          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex rounded-full bg-gradient-to-r from-blue-700 to-cyan-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:brightness-110"
            >
              {t("blog_back_home")}
            </Link>
          </div>
        </Section>
      </>
    );
  }

  return (
    <>
      <Section innerClassName="pt-24 pb-16 md:pt-28 md:pb-22">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          {t("nav_blog")}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
          {t("blog_intro")}
        </p>
      </Section>

      <Section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {DEMO_BLOG_LIST.map((p) => (
            <TiltCard key={p.slug} maxTiltDeg={9} className="h-full">
              <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-blue-100 bg-white/90 shadow-md shadow-blue-500/10 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/15">
                <Link
                  href={`/blog/${p.slug}`}
                  className="block overflow-hidden px-3 pt-3 sm:px-4 sm:pt-4"
                >
                  <Image
                    src={p.cover.src}
                    alt={p.cover.alt}
                    width={900}
                    height={520}
                    className="h-60 w-full rounded-xl bg-slate-100 object-contain object-center transition duration-300 hover:scale-[1.01] sm:h-64"
                    sizes="(max-width:1024px) 100vw, 33vw"
                    loading="lazy"
                  />
                </Link>
                <div className="flex flex-1 flex-col p-6">
                  <time
                    className="text-xs font-bold uppercase tracking-wider text-blue-600"
                    dateTime={p.iso}
                  >
                    {t(p.dateKey)}
                  </time>
                  <h2 className="mt-3 text-lg font-bold text-slate-900">
                    <Link
                      href={`/blog/${p.slug}`}
                      className="rounded-md outline-offset-4 transition hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
                    >
                      {t(p.titleKey)}
                    </Link>
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                    {t(p.excerptKey)}
                  </p>
                  <div className="mt-5">
                    <Link
                      href={`/blog/${p.slug}`}
                      className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-700 to-cyan-500 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition hover:brightness-110"
                    >
                      {t("blog_read_more")}
                    </Link>
                  </div>
                </div>
              </article>
            </TiltCard>
          ))}
        </div>
        <p className="mt-10 text-center text-slate-600">
          {t("blog_suggest_pre")}{" "}
          <Link
            href="/contact"
            className="fx-link font-bold text-blue-700 underline"
          >
            {t("blog_suggest_link")}
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
