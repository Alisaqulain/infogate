import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/section";
import { stock } from "@/lib/remote-images";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `Learn about ${SITE_NAME}: SEO, websites, and long-term growth.`,
};

export default function AboutPage() {
  return (
    <>
      <Section innerClassName="pt-24 pb-16 md:pt-28 md:pb-22">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
          About us
        </p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          We connect the pieces behind your online growth
        </h1>
        <p className="mt-6 max-w-3xl text-lg text-slate-600">
          {SITE_NAME} exists to make search and websites feel less chaotic. Our
          logo arc is a reminder: technical SEO, content, design, and analytics
          should fit together, not fight each other.
        </p>
        <div className="relative mt-10 aspect-[21/9] max-w-4xl overflow-hidden rounded-2xl border border-blue-100 shadow-xl shadow-blue-500/10">
          <Image
            src={stock.aboutTeam.src}
            alt={stock.aboutTeam.alt}
            fill
            className="object-cover"
            sizes="(max-width: 896px) 100vw, 896px"
            priority
          />
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">How we work</h2>
            <p className="mt-4 text-slate-600">
              We start with your business goals, then map the search landscape.
              You get a plain-language plan: what to fix on the site, what to
              publish, and how we measure success. No black boxes, just
              structured execution.
            </p>
            <p className="mt-4 text-slate-600">
              Whether you need a full SEO retainer or a new marketing site with
              lead capture, we build for speed, clarity, and conversions.
            </p>
          </div>
          <ul className="space-y-4 rounded-2xl border border-blue-100 bg-white/90 p-6 shadow-lg shadow-blue-500/10">
            {[
              "Transparent reporting and realistic timelines",
              "Modern stacks (e.g. Next.js) when we build sites",
              "Ethical SEO: no risky shortcuts",
              "Collaboration with your team or agency partners",
            ].map((line) => (
              <li
                key={line}
                className="flex gap-3 text-sm font-semibold text-slate-800"
              >
                <span
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-xs text-white"
                  aria-hidden
                >
                  ✓
                </span>
                {line}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section tone="deep" innerClassName="py-16 md:py-20">
        <div className="relative mx-auto mb-10 aspect-[2/1] max-w-3xl overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/30">
          <Image
            src={stock.services.analytics.src}
            alt={stock.services.analytics.alt}
            fill
            className="object-cover opacity-90"
            sizes="(max-width: 768px) 100vw, 768px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
        </div>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
            Ready when you are
          </h2>
          <p className="mt-3 text-slate-300">
            Share your URL and goals. We will tell you honestly if we are the
            right fit.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-8 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/25"
          >
            Contact {SITE_NAME}
          </Link>
        </div>
      </Section>
    </>
  );
}
