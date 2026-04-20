import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Section } from "@/components/section";
import { stock } from "@/lib/remote-images";

type Params = { locale: string; slug: string };

export const metadata: Metadata = {
  title: "Blog Post",
  description: "InfoGate blog post.",
};

const demoPosts = [
  {
    slug: "accelerate-with-unified-platforms",
    title: "Accelerate Growth with Unified Platforms",
    date: "Apr 1, 2026",
    iso: "2026-04-01",
    cover: stock.blog.speed,
    body: [
      "When your tools are fragmented, progress slows down. Teams lose time switching contexts, duplicating work, and reconciling inconsistent data.",
      "InfoGate brings your workflows, insights, and operational building blocks into one unified environment—so you can stay compliant, secure, and ready to expand.",
    ],
  },
  {
    slug: "compliance-ready-from-day-one",
    title: "Compliance-Ready from Day One",
    date: "Mar 15, 2026",
    iso: "2026-03-15",
    cover: stock.blog.local,
    body: [
      "Compliance is easier (and cheaper) when it’s built into your processes early. Waiting until growth forces the issue often leads to rushed decisions and avoidable risk.",
      "With InfoGate, you can standardize registration, automate operational steps, and maintain visibility across tools—without sacrificing speed.",
    ],
  },
  {
    slug: "digitize-forms-and-workflows",
    title: "Digitize Forms and Workflows the Smart Way",
    date: "Mar 1, 2026",
    iso: "2026-03-01",
    cover: stock.blog.forms,
    body: [
      "Manual workflows create bottlenecks—especially when your business is scaling. Every handoff increases delay, errors, and missed opportunities.",
      "Quick process automation (QPA) helps you connect steps, reduce mistakes, and deploy improvements rapidly—so your operations stay smooth as demand grows.",
    ],
  },
] as const;

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = demoPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <>
      <Section innerClassName="pt-24 pb-10 md:pt-28 md:pb-14">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-700">
          Blog
        </p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          {post.title}
        </h1>
        <time className="mt-4 block text-sm font-semibold text-slate-600" dateTime={post.iso}>
          {post.date}
        </time>
      </Section>

      <Section>
        <div className="mx-auto max-w-3xl">
          <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white/90 shadow-lg shadow-blue-500/10">
            <Image
              src={post.cover.src}
              alt={post.cover.alt}
              width={1200}
              height={720}
              className="h-72 w-full object-cover object-center md:h-96"
              sizes="(max-width: 768px) 100vw, 768px"
              loading="lazy"
            />
          </div>

          <div className="prose prose-slate mt-8 max-w-none">
            {post.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/blog"
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-slate-50"
            >
              Back to Blog
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-700 to-cyan-500 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition hover:brightness-110"
            >
              Consult Our Experts Today
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}

