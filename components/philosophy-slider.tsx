"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { stock } from "@/lib/remote-images";

const slides = [
  {
    key: "unified-visibility",
    title: "Unified Visibility",
    subtitle:
      "Gain a 360-degree view of your business tools and data in one secure place.",
    image: stock.discover,
  },
  {
    key: "smart-decisions",
    title: "Smart Decisions",
    subtitle:
      "Move from guesswork to data-driven strategy with AI-powered insights.",
    image: stock.services.webDev,
  },
  {
    key: "seamless-adoption",
    title: "Seamless Adoption",
    subtitle:
      "Streamline technology integration and enhance process efficiency.",
    image: stock.services.onPage,
  },
] as const;

export function PhilosophySlider() {
  const [active, setActive] = useState(0);
  const current = slides[active];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 3800);
    return () => window.clearInterval(timer);
  }, []);

  const prev = () => {
    setActive((v) => (v - 1 + slides.length) % slides.length);
  };

  const next = () => {
    setActive((v) => (v + 1) % slides.length);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.05fr] lg:items-center">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Stop Juggling. Start Expanding.
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">
          In a world overflowing with fragmented tools, InfoGate provides the
          unified digital environment your business deserves. We are more than a
          platform; we are an innovative data and IT ecosystem that empowers you
          to identify, assess, and implement the right digital solutions for
          your unique operational needs.
        </p>
        <div className="mt-6 rounded-2xl border border-blue-100 bg-white p-5 shadow-md shadow-blue-500/10">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
            Active Benefit
          </p>
          <h3 className="mt-2 text-2xl font-extrabold text-slate-900">
            {current.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {current.subtitle}
          </p>
        </div>
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
                  : "pointer-events-none opacity-0"
              )}
              aria-hidden={index !== active}
            >
              <Image
                src={slide.image.src}
                alt={slide.image.alt}
                width={1100}
                height={900}
                className="h-full w-full object-contain bg-slate-50"
                sizes="(max-width:1024px) 100vw, 45vw"
                loading="lazy"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/75 via-slate-950/35 to-transparent px-5 py-5 text-white">
                <h3 className="text-lg font-extrabold">{slide.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-200">
                  {slide.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          aria-label="Previous slide"
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
          aria-label="Next slide"
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
                index === active ? "bg-white" : "bg-white/40 hover:bg-white/70"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

