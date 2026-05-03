"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "@/i18n/useTranslation";
import { cn } from "@/lib/utils";
import { stock } from "@/lib/remote-images";

export function PhilosophySlider() {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);

  const slides = useMemo(
    () =>
      [
        {
          key: "unified-visibility",
          title: t("home_steps_discover_title"),
          image: stock.heroSide,
        },
        {
          key: "smart-decisions",
          title: t("home_steps_connect_title"),
          image: stock.services.webDev,
        },
        {
          key: "seamless-adoption",
          title: t("home_steps_grow_title"),
          image: stock.services.onPage,
        },
      ] as const,
    [t],
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 3800);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  const prev = () => {
    setActive((v) => (v - 1 + slides.length) % slides.length);
  };

  const next = () => {
    setActive((v) => (v + 1) % slides.length);
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
      <div className="mx-auto mb-10 max-w-3xl text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
          {t("home_philosophy_kicker")}
        </p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {t("home_deep_title")}
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">
          {t("home_deep_body")}
        </p>
      </div>
      <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-xl shadow-blue-500/10">
        <div className="relative min-h-[24rem] w-full sm:min-h-[26rem]">
          {slides.map((slide, index) => (
            <div
              key={slide.key}
              className={cn(
                "absolute inset-0 transition duration-500",
                index === active
                  ? "pointer-events-auto opacity-100"
                  : "pointer-events-none opacity-0",
              )}
              aria-hidden={index !== active}
            >
              <Image
                src={slide.image.src}
                alt={slide.image.alt}
                width={1100}
                height={900}
                className="h-full w-full bg-slate-50 object-contain"
                sizes="(max-width:1024px) 100vw, 896px"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          aria-label={t("slider_prev")}
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/60 bg-white/85 p-2 text-slate-900 shadow transition hover:bg-white"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
            <path
              d="M15 18l-6-6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button
          type="button"
          aria-label={t("slider_next")}
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/60 bg-white/85 p-2 text-slate-900 shadow transition hover:bg-white"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
            <path
              d="M9 18l6-6-6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
          {slides.map((slide, index) => (
            <button
              key={slide.key}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Go to ${slide.title} slide`}
              aria-pressed={index === active}
              className={cn(
                "h-2.5 w-2.5 rounded-full border border-white/70 transition",
                index === active ? "bg-white" : "bg-white/40 hover:bg-white/70",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
