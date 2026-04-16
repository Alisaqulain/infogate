import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/section";
import { TiltCard } from "@/components/tilt-card";
import { stock } from "@/lib/remote-images";

export const metadata: Metadata = {
  title: "Blog",
  description: "Digital transformation insights, product stories, and practical innovation notes from InfoGate.",
};

export default async function BlogPage() {
  const t = await getTranslations();

  const posts = [
    {
      title: t("blog_post1_title"),
      excerpt: t("blog_post1_excerpt"),
      date: t("blog_post1_date"),
      iso: "2026-04-01",
      cover: stock.blog.speed,
    },
    {
      title: t("blog_post2_title"),
      excerpt: t("blog_post2_excerpt"),
      date: t("blog_post2_date"),
      iso: "2026-03-15",
      cover: stock.blog.local,
    },
    {
      title: t("blog_post3_title"),
      excerpt: t("blog_post3_excerpt"),
      date: t("blog_post3_date"),
      iso: "2026-03-01",
      cover: stock.blog.forms,
    },
  ] as const;

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
          {posts.map((p) => (
            <TiltCard key={p.title} maxTiltDeg={9} className="h-full">
              <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-blue-100 bg-white/90 shadow-md shadow-blue-500/10 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/15">
                <Image
                  src={p.cover.src}
                  alt={p.cover.alt}
                  width={900}
                  height={520}
                  className="h-44 w-full object-cover"
                  sizes="(max-width:1024px) 100vw, 33vw"
                />
                <div className="flex flex-1 flex-col p-6">
                  <time
                    className="text-xs font-bold uppercase tracking-wider text-blue-600"
                    dateTime={p.iso}
                  >
                    {p.date}
                  </time>
                  <h2 className="mt-3 text-lg font-bold text-slate-900">
                    {p.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                    {p.excerpt}
                  </p>
                  <span className="mt-4 text-sm font-bold text-blue-700 opacity-80">
                    {t("blog_coming_soon")}
                  </span>
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

