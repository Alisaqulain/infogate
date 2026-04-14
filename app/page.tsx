import Image from "next/image";
import Link from "next/link";
import { LeadForm } from "@/components/lead-form";
import { Magnetic } from "@/components/magnetic";
import { Section } from "@/components/section";
import { Hero3DBackdrop } from "@/components/hero-3d-backdrop";
import { HeroFxOverlay } from "@/components/hero-fx-overlay";
import { TiltCard } from "@/components/tilt-card";
import { stock } from "@/lib/remote-images";

export default function HomePage() {
  return (
    <>
      <Section innerClassName="pt-24 pb-20 md:pt-28 md:pb-28">
        <Hero3DBackdrop className="pointer-events-none absolute bottom-0 top-0 left-1/2 z-0 w-screen -translate-x-1/2 opacity-70 [mask-image:radial-gradient(78%_70%_at_82%_46%,black_35%,transparent_78%)]" />
        <HeroFxOverlay className="pointer-events-none absolute bottom-0 top-0 left-1/2 z-0 w-screen -translate-x-1/2 opacity-80" />
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.15fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
              SEO • Websites • Growth
            </p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
              Open the gate to{" "}
              <span className="bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent">
                traffic & leads
              </span>{" "}
              that actually convert.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
              We plan and execute SEO, build fast modern sites, and connect every
              piece—like the INFO GATE puzzle—so search engines and customers
              understand you instantly.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Magnetic strength={12}>
                <Link
                  href="/contact"
                  data-fx-reveal="off"
                  className="fx-btn inline-flex rounded-full bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-600/25 transition hover:brightness-110"
                >
                  Get a free SEO check
                </Link>
              </Magnetic>
              <Magnetic strength={10}>
                <Link
                  href="/services"
                  className="fx-btn inline-flex rounded-full border-2 border-blue-200 bg-white px-7 py-3.5 text-sm font-bold text-blue-900 shadow-sm transition hover:border-blue-400 hover:bg-blue-50/80"
                >
                  View services
                </Link>
              </Magnetic>
            </div>
            {/* <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-blue-100/80 pt-8 text-center sm:max-w-md sm:text-left">
              <div>
                <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Focus
                </dt>
                <dd className="mt-1 text-lg font-extrabold text-slate-900">
                  SEO-first
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Delivery
                </dt>
                <dd className="mt-1 text-lg font-extrabold text-slate-900">
                  Clear plans
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Fit
                </dt>
                <dd className="mt-1 text-lg font-extrabold text-slate-900">
                  SMB & brands
                </dd>
              </div>
            </dl> */}
          </div>
          <div className="relative flex justify-center lg:justify-end">
            <TiltCard className="relative w-full max-w-xl lg:max-w-[34rem]">
              <div className="relative w-full rounded-3xl border border-blue-100 bg-white/90 p-8 shadow-2xl shadow-blue-500/15 backdrop-blur-sm">
                <div className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-cyan-400/30 blur-2xl" />
                <div className="pointer-events-none absolute -bottom-10 -right-10 h-44 w-44 rounded-full bg-blue-600/25 blur-2xl" />
                <Image
                  src={stock.heroSide.src}
                  alt={stock.heroSide.alt}
                  width={1200}
                  height={750}
                  className="h-64 w-full object-cover sm:h-72"
                  sizes="(max-width: 1024px) 100vw, 544px"
                  priority
                  loading="eager"
                />
                <dl className="relative z-10 mt-6 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Focus
                    </dt>
                    <dd className="mt-1 text-sm font-extrabold text-slate-900">
                      SEO-first
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Delivery
                    </dt>
                    <dd className="mt-1 text-sm font-extrabold text-slate-900">
                      Clear plans
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Fit
                    </dt>
                    <dd className="mt-1 text-sm font-extrabold text-slate-900">
                      SMB & brands
                    </dd>
                  </div>
                </dl>
              </div>
            </TiltCard>
            {/* <div className="relative mt-6 w-full max-w-md overflow-hidden rounded-2xl border border-blue-100 shadow-lg shadow-blue-500/15">
              <Image
                src={stock.heroSide.src}
                alt={stock.heroSide.alt}
                width={1200}
                height={750}
                className="h-52 w-full object-cover sm:h-60"
                sizes="(max-width: 1024px) 100vw, 420px"
              />
            </div> */}
          </div>
        </div>
      </Section>

      <Section tone="deep" innerClassName="py-16 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Built for businesses that want real visibility
          </h2>
          <p className="mt-4 text-lg text-slate-300">
            Technical SEO, content, and design that work together—not random
            tactics. We align your site with how people actually search.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {[
            {
              title: "Discover",
              text: "Audit keywords, competitors, and your current site health.",
              visual: stock.discover,
            },
            {
              title: "Connect",
              text: "Wire structure, speed, and messaging so Google and users trust you.",
              visual: stock.connect,
            },
            {
              title: "Grow",
              text: "Measure rankings and leads; refine month on month.",
              visual: stock.grow,
            },
          ].map((item) => (
            <TiltCard key={item.title} maxTiltDeg={10}>
              <div className="fx-hoverlift group overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg shadow-black/20 backdrop-blur-sm transition hover:-translate-y-1 hover:border-cyan-200/35 hover:bg-white/7 hover:shadow-[0_28px_90px_-22px_rgba(34,211,238,0.55)] hover:shadow-cyan-500/40">
                <Image
                  src={item.visual.src}
                  alt={item.visual.alt}
                  width={800}
                  height={480}
                  className="h-36 w-full object-cover opacity-95 transition duration-300 group-hover:opacity-100"
                  sizes="(max-width:640px) 100vw, 33vw"
                />
                <div className="p-6">
                  <h3 className="text-lg font-bold text-cyan-200">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">
                    {item.text}
                  </p>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </Section>

      <Section>
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            What we can do for you
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Pick a lane—or combine services. Every engagement starts with a
            short discovery call.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {[
            {
              title: "SEO strategy & execution",
              body: "Keyword maps, on-page optimization, internal links, and reporting you can read without a dictionary.",
              visual: stock.services.audit,
            },
            {
              title: "Websites that sell",
              body: "Fast Next.js/React builds (like this one), clear CTAs, and forms that feed your inbox.",
              visual: stock.services.webDev,
            },
            {
              title: "Local & maps presence",
              body: "Google Business Profile, citations, and location pages for multi-city brands.",
              visual: stock.services.local,
            },
            {
              title: "Content that ranks",
              body: "Briefs, blogs, and landing pages aligned to search intent—not filler.",
              visual: stock.services.onPage,
            },
          ].map((card) => (
            <TiltCard key={card.title} className="h-full">
              <article className="group relative h-full overflow-hidden rounded-2xl border border-blue-100 bg-white/90 shadow-lg shadow-blue-500/10 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/60 hover:shadow-[0_26px_70px_-24px_rgba(59,130,246,0.45)] hover:shadow-cyan-500/20 hover:ring-1 hover:ring-cyan-400/25">
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
                  aria-hidden
                >
                  <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />
                  <div className="absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-cyan-200/10" />
                </div>
                <Image
                  src={card.visual.src}
                  alt={card.visual.alt}
                  width={800}
                  height={420}
                  className="h-44 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                  sizes="(max-width:768px) 100vw, 50vw"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-slate-600">{card.body}</p>
                </div>
              </article>
            </TiltCard>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/pricing"
            className="fx-link inline-flex font-bold text-blue-700 underline-offset-4 hover:underline"
          >
            See pricing →
          </Link>
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Tell us what you need
            </h2>
            <p className="mt-3 text-slate-600">
              One short form is enough. We route leads straight to email so you
              can reply from your normal inbox—ideal if you sell SEO or websites
              to clients too.
            </p>
            <ul className="mt-6 space-y-3 text-sm font-medium text-slate-700">
              <li className="flex gap-2">
                <span className="text-cyan-500">✓</span>
                No spam—only real project details
              </li>
              <li className="flex gap-2">
                <span className="text-cyan-500">✓</span>
                Works after a 1-minute Web3Forms setup
              </li>
              <li className="flex gap-2">
                <span className="text-cyan-500">✓</span>
                Same form on Contact page for deep dives
              </li>
            </ul>
          </div>
          <LeadForm
            heading="Quick lead form"
            subheading="We usually respond within one business day."
          />
        </div>
      </Section>
    </>
  );
}
