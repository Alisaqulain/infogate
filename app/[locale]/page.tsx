import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { LeadForm } from "@/components/lead-form";
import { Magnetic } from "@/components/magnetic";
import { Section } from "@/components/section";
import { Hero3DBackdrop } from "@/components/hero-3d-backdrop";
import { HeroFxOverlay } from "@/components/hero-fx-overlay";
import { TiltCard } from "@/components/tilt-card";
import { stock } from "@/lib/remote-images";
import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  const t = await getTranslations();

  return (
    <>
      <Section innerClassName="pt-24 pb-20 md:pt-28 md:pb-28">
        <Hero3DBackdrop className="pointer-events-none absolute bottom-0 top-0 left-1/2 z-0 w-screen -translate-x-1/2 opacity-70 [mask-image:radial-gradient(78%_70%_at_82%_46%,black_35%,transparent_78%)]" />
        <HeroFxOverlay className="pointer-events-none absolute bottom-0 top-0 left-1/2 z-0 w-screen -translate-x-1/2 opacity-80" />
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.15fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
              {t("home_kicker")}
            </p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
              {t("home_h1_pre")}{" "}
              <span className="bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent">
                {t("home_h1_highlight")}
              </span>{" "}
              {t("home_h1_post")}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
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
                  className="fx-btn inline-flex rounded-full border-2 border-blue-200 bg-white px-7 py-3.5 text-sm font-bold text-blue-900 shadow-sm transition hover:border-blue-400 hover:bg-blue-50/80"
                >
                  {t("home_cta_view_services")}
                </Link>
              </Magnetic>
            </div>
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
                      {t("home_stat_focus")}
                    </dt>
                    <dd className="mt-1 text-sm font-extrabold text-slate-900">
                      {t("home_stat_focus_value")}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {t("home_stat_delivery")}
                    </dt>
                    <dd className="mt-1 text-sm font-extrabold text-slate-900">
                      {t("home_stat_delivery_value")}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      {t("home_stat_fit")}
                    </dt>
                    <dd className="mt-1 text-sm font-extrabold text-slate-900">
                      {t("home_stat_fit_value")}
                    </dd>
                  </div>
                </dl>
              </div>
            </TiltCard>
          </div>
        </div>
      </Section>

      <Section tone="deep" innerClassName="py-16 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {t("home_deep_title")}
          </h2>
          <p className="mt-4 text-lg text-slate-300">
            {t("home_deep_body")}
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {[
            {
              title: t("home_steps_discover_title"),
              text: t("home_steps_discover_body"),
              visual: stock.discover,
            },
            {
              title: t("home_steps_connect_title"),
              text: t("home_steps_connect_body"),
              visual: stock.connect,
            },
            {
              title: t("home_steps_grow_title"),
              text: t("home_steps_grow_body"),
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
            {t("home_offer_title")}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            {t("home_offer_body")}
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {[
            {
              title: t("home_offer_card1_title"),
              body: t("home_offer_card1_body"),
              visual: stock.services.audit,
            },
            {
              title: t("home_offer_card2_title"),
              body: t("home_offer_card2_body"),
              visual: stock.services.webDev,
            },
            {
              title: t("home_offer_card3_title"),
              body: t("home_offer_card3_body"),
              visual: stock.services.local,
            },
            {
              title: t("home_offer_card4_title"),
              body: t("home_offer_card4_body"),
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
            {t("home_offer_link_pricing")}
          </Link>
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              {t("home_lead_title")}
            </h2>
            <p className="mt-3 text-slate-600">
              {t("home_lead_body")}
            </p>
            <ul className="mt-6 space-y-3 text-sm font-medium text-slate-700">
              <li className="flex gap-2">
                <span className="text-cyan-500">✓</span>
                {t("home_lead_bullet1")}
              </li>
              <li className="flex gap-2">
                <span className="text-cyan-500">✓</span>
                {t("home_lead_bullet2")}
              </li>
              <li className="flex gap-2">
                <span className="text-cyan-500">✓</span>
                {t("home_lead_bullet3")}
              </li>
            </ul>
          </div>
          <LeadForm
            heading={t("home_leadform_heading")}
            subheading={t("home_leadform_subheading")}
          />
        </div>
      </Section>
    </>
  );
}

