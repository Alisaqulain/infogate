import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/section";
import { TiltCard } from "@/components/tilt-card";
import { stock } from "@/lib/remote-images";

export const metadata: Metadata = {
  title: "Blog",
  description: "SEO tips, website notes, and updates from INFO GATE.",
};

const posts = [
  {
    title: "Why site speed still matters for SEO in 2026",
    excerpt:
      "Core Web Vitals, UX, and how fast Next.js-style stacks help you win both rankings and trust.",
    date: "Apr 2026",
    iso: "2026-04-01",
    cover: stock.blog.speed,
  },
  {
    title: "Local SEO checklist for multi-location brands",
    excerpt:
      "From Google Business Profile to landing page patterns that avoid cannibalization.",
    date: "Mar 2026",
    iso: "2026-03-15",
    cover: stock.blog.local,
  },
  {
    title: "Forms that actually convert: lead capture without friction",
    excerpt:
      "Short fields, clear expectations, and email delivery your team will actually see.",
    date: "Mar 2026",
    iso: "2026-03-01",
    cover: stock.blog.forms,
  },
];

export default function BlogPage() {
  return (
    <>
      <Section innerClassName="pt-24 pb-16 md:pt-28 md:pb-22">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Blog
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">
          Practical notes on search, websites, and measurement—written for
          founders and marketing teams, not algorithms.
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
                  <p className="mt-2 flex-1 text-sm text-slate-600">
                    {p.excerpt}
                  </p>
                  <span className="mt-4 text-sm font-bold text-blue-700 opacity-80">
                    Full articles — coming soon
                  </span>
                </div>
              </article>
            </TiltCard>
          ))}
        </div>
        <p className="mt-10 text-center text-slate-600">
          Want a topic covered?{" "}
          <Link href="/contact" className="fx-link font-bold text-blue-700 underline">
            Suggest it via Contact
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
