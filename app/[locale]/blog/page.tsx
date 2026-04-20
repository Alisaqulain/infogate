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
      excerpt: `${t("blog_post1_excerpt")} Learn how unified systems remove friction, improve visibility, and help teams scale with confidence.`,
      date: t("blog_post1_date"),
      iso: "2026-04-01",
      cover: stock.blog.speed,
      slug: "accelerate-with-unified-platforms",
    },
    {
      title: t("blog_post2_title"),
      excerpt: `${t("blog_post2_excerpt")} Build secure, compliant processes early so growth never forces rushed decisions later.`,
      date: t("blog_post2_date"),
      iso: "2026-03-15",
      cover: stock.blog.local,
      slug: "compliance-ready-from-day-one",
    },
    {
      title: t("blog_post3_title"),
      excerpt: `${t("blog_post3_excerpt")} See how automation reduces delays, eliminates errors, and improves customer experience end-to-end.`,
      date: t("blog_post3_date"),
      iso: "2026-03-01",
      cover: stock.blog.forms,
      slug: "digitize-forms-and-workflows",
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
                <Link href={`/blog/${p.slug}`} className="block overflow-hidden">
                  <Image
                    src={p.cover.src}
                    alt={p.cover.alt}
                    width={900}
                    height={520}
                    className="w-full h-auto object-cover transition duration-300 hover:scale-[1.02]"
                    sizes="(max-width:1024px) 100vw, 33vw"
                    loading="lazy"
                  />
                </Link>
                <div className="flex flex-1 flex-col p-6">
                  <time
                    className="text-xs font-bold uppercase tracking-wider text-blue-600"
                    dateTime={p.iso}
                  >
                    {p.date}
                  </time>
                  <h2 className="mt-3 text-lg font-bold text-slate-900">
                    <Link
                      href={`/blog/${p.slug}`}
                      className="rounded-md outline-offset-4 transition hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
                    >
                      {p.title}
                    </Link>
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                    {p.excerpt}
                  </p>
                  <div className="mt-5">
                    <Link
                      href={`/blog/${p.slug}`}
                      className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-700 to-cyan-500 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition hover:brightness-110"
                    >
                      Read More
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

