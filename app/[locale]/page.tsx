import type { ReactNode } from "react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Magnetic } from "@/components/magnetic";
import { Section } from "@/components/section";
import { Hero3DBackdrop } from "@/components/hero-3d-backdrop";
import { HeroFxOverlay } from "@/components/hero-fx-overlay";
import { TiltCard } from "@/components/tilt-card";
import { stock } from "@/lib/remote-images";
import { WhyInfoGateTabs } from "@/components/why-infogate-tabs";
import { PhilosophySlider } from "@/components/philosophy-slider";
import { SHOW_BLOG } from "@/lib/features";
import { DEMO_BLOG_LIST } from "@/lib/demo-blog";

export default async function HomePage() {
  const t = await getTranslations();

  const ecosystemCards: {
    title: string;
    eyebrow?: string;
    icon: ReactNode;
    bullets: string[];
  }[] = [
    {
      title: t("home_eco_1_title"),
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
          <path
            d="M4 6h16M4 12h10M4 18h16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
      bullets: [t("home_eco_1_b1"), t("home_eco_1_b2"), t("home_eco_1_b3")],
    },
    {
      title: t("home_eco_2_title"),
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
          <path d="M7 7h10v10H7z" stroke="currentColor" strokeWidth="2" />
          <path
            d="M7 12h10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
      bullets: [t("home_eco_2_b1"), t("home_eco_2_b2"), t("home_eco_2_b3")],
    },
    {
      title: t("home_eco_3_title"),
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
          <path d="M4 7h16v10H4z" stroke="currentColor" strokeWidth="2" />
          <path
            d="M7 10h5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M7 13h9"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
      bullets: [
        t("home_eco_3_b1"),
        t("home_eco_3_b2"),
        t("home_eco_3_b3"),
        t("home_eco_3_b4"),
      ],
    },
    {
      title: t("home_eco_4_title"),
      eyebrow: t("home_eco_4_eyebrow"),
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
          <path
            d="M6 16l4-4 3 3 5-7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 20h16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
      bullets: [
        t("home_eco_4_b1"),
        t("home_eco_4_b2"),
        t("home_eco_4_b3"),
        t("home_eco_4_b4"),
      ],
    },
    {
      title: t("home_eco_5_title"),
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
          <path
            d="M8 7h8M8 12h8M8 17h8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path d="M5 4h14v16H5z" stroke="currentColor" strokeWidth="2" />
        </svg>
      ),
      bullets: [
        t("home_eco_5_b1"),
        t("home_eco_5_b2"),
        t("home_eco_5_b3"),
        t("home_eco_5_b4"),
      ],
    },
    {
      title: t("home_eco_6_title"),
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
          <path d="M7 3h10v18H7z" stroke="currentColor" strokeWidth="2" />
          <path
            d="M9 8h6M9 12h6M9 16h6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
      bullets: [t("home_eco_6_b1"), t("home_eco_6_b2"), t("home_eco_6_b3")],
    },
  ];

  return (
    <>
      <Section
        id="top"
        tone="deep"
        innerClassName="pt-24 pb-16 md:pt-28 md:pb-24"
        className="bg-slate-950"
      >
        <Hero3DBackdrop className="pointer-events-none absolute bottom-0 top-0 left-1/2 z-0 w-screen -translate-x-1/2 opacity-70 [mask-image:radial-gradient(78%_70%_at_82%_46%,black_35%,transparent_78%)]" />
        <HeroFxOverlay className="pointer-events-none absolute bottom-0 top-0 left-1/2 z-0 w-screen -translate-x-1/2 opacity-80" />
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.15fr]">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
              {t("home_h1_pre")}{" "}
              <span className="text-cyan-300">{t("home_h1_highlight")}</span>
              {t("home_h1_post") ? ` ${t("home_h1_post")}` : ""}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-200">
              {t("home_intro")}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Magnetic strength={12}>
                <Link
                  href="/contact"
                  data-fx-reveal="off"
                  className="fx-btn inline-flex rounded-full bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-600/25 transition hover:brightness-110"
                >
                  {t("home_cta_free_check")}
                </Link>
              </Magnetic>
              <Magnetic strength={10}>
                <Link
                  href="/services"
                  className="fx-btn inline-flex rounded-full border border-white/25 bg-white/10 px-7 py-3.5 text-sm font-bold text-white shadow-sm backdrop-blur-sm transition hover:bg-white/15"
                >
                  {t("home_cta_view_services")}
                </Link>
              </Magnetic>
            </div>
          </div>
          <div className="relative flex justify-center lg:justify-end">
            <TiltCard className="relative w-full max-w-xl lg:max-w-[34rem]">
              <div className="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30 backdrop-blur-sm sm:p-8">
                <div className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-cyan-400/30 blur-2xl" />
                <div className="pointer-events-none absolute -bottom-10 -right-10 h-44 w-44 rounded-full bg-blue-600/25 blur-2xl" />
                <div className="px-3 sm:px-4">
                  <Image
                    src={stock.heroSide.src}
                    alt={stock.heroSide.alt}
                    width={1200}
                    height={750}
                    className="h-72 w-full rounded-2xl bg-slate-100 object-contain object-center sm:h-80 lg:h-[24rem]"
                    sizes="(max-width: 1024px) 100vw, 544px"
                    priority
                    loading="eager"
                  />
                </div>
              </div>
            </TiltCard>
          </div>
        </div>
      </Section>

      <Section id="philosophy">
        <PhilosophySlider />
      </Section>

      <Section id="why" tone="deep">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {t("home_why_title")}
          </h2>
          <p className="mt-4 text-lg text-slate-300">{t("home_why_desc")}</p>
        </div>
        <WhyInfoGateTabs />
      </Section>

      <Section id="ecosystem">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {t("home_ecosystem_title")}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            {t("home_ecosystem_desc")}
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ecosystemCards.map((m) => (
            <TiltCard key={m.title} className="h-full" maxTiltDeg={9}>
              <Link
                href="/services"
                className="group relative block h-full overflow-hidden rounded-2xl border border-blue-100 bg-white/90 p-6 shadow-lg shadow-blue-500/10 transition duration-200 hover:-translate-y-1 hover:border-cyan-300/60 hover:shadow-[0_26px_70px_-24px_rgba(59,130,246,0.35)] hover:shadow-cyan-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
              >
                <div className="flex items-start gap-3">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 text-white shadow-md shadow-blue-500/20">
                    {m.icon}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-extrabold text-slate-900">
                      {m.title}
                    </h3>
                    {m.eyebrow ? (
                      <p className="mt-1 text-sm font-semibold text-blue-700">
                        {m.eyebrow}
                      </p>
                    ) : null}
                  </div>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-slate-700">
                  {m.bullets.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span className="mt-0.5 text-cyan-600">✓</span>
                      <span className="leading-relaxed">{b}</span>
                    </li>
                  ))}
                </ul>
              </Link>
            </TiltCard>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/services"
            className="inline-flex rounded-full bg-gradient-to-r from-blue-700 to-cyan-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:brightness-110"
          >
            {t("home_view_all_services")}
          </Link>
        </div>
      </Section>

      <Section id="evolution" tone="deep">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {t("home_evolution_title")}
          </h2>
          <p className="mt-4 text-lg text-slate-300">
            • {t("home_evolution_b1")}
            <br />
            • {t("home_evolution_b2")}
            <br />• {t("home_evolution_b3")}
          </p>
          <div className="mt-8">
            <Magnetic strength={12}>
              <Link
                href="/contact"
                className="fx-btn inline-flex rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-8 py-3.5 text-sm font-extrabold text-slate-950 shadow-xl shadow-cyan-500/20 transition hover:brightness-110"
              >
                {t("home_evolution_cta")}
              </Link>
            </Magnetic>
          </div>
        </div>
      </Section>

      {SHOW_BLOG ? (
        <Section id="blog">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              {t("nav_blog")}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              {t("blog_intro")}
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {DEMO_BLOG_LIST.map((p) => (
              <TiltCard key={p.slug} className="h-full" maxTiltDeg={9}>
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-blue-100 bg-white/90 shadow-md shadow-blue-500/10 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/15">
                  <Link
                    href={`/blog/${p.slug}`}
                    className="block overflow-hidden px-3 pt-3 sm:px-4 sm:pt-4"
                  >
                    <Image
                      src={p.cover.src}
                      alt={p.cover.alt}
                      width={900}
                      height={520}
                      className="h-60 w-full rounded-xl bg-slate-100 object-contain object-center transition duration-300 group-hover:scale-[1.01] sm:h-64"
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
                    <h3 className="mt-3 text-lg font-extrabold text-slate-900">
                      <Link
                        href={`/blog/${p.slug}`}
                        className="rounded-md outline-offset-4 transition hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
                      >
                        {t(p.titleKey)}
                      </Link>
                    </h3>
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
        </Section>
      ) : null}

      <Section id="final-cta" tone="deep">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {t("home_lead_title")}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-slate-300">
            {t("home_lead_body")}
          </p>
          <div className="mt-8">
            <Magnetic strength={12}>
              <Link
                href="/contact"
                className="fx-btn inline-flex rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 px-8 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-blue-600/25 transition hover:brightness-110"
              >
                {t("home_final_cta")}
              </Link>
            </Magnetic>
          </div>
        </div>
      </Section>
    </>
  );
}
