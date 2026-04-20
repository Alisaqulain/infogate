"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type TabKey = "core" | "growth";

export function WhyInfoGateTabs() {
  const [tab, setTab] = useState<TabKey>("core");

  const items = useMemo(() => {
    if (tab === "core") {
      return [
        {
          title: "Unified Visibility",
          body: "Gain a 360-degree view of your business tools and data in one secure place.",
        },
        {
          title: "Smart Decisions",
          body: "Move from guesswork to data-driven strategy with AI-powered insights.",
        },
        {
          title: "Seamless Adoption",
          body: "Streamline technology integration and enhance process efficiency.",
        },
      ] as const;
    }
    return [
      {
        title: "Digital Transformation",
        body: "We make the transition to digital faster, easier, and more effective.",
      },
    ] as const;
  }, [tab]);

  return (
    <div className="mt-8">
      <div
        className="inline-flex w-full flex-wrap gap-2 rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-sm sm:w-auto"
        role="tablist"
        aria-label="Why InfoGate tabs"
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab === "core"}
          className={cn(
            "rounded-xl px-4 py-2 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300",
            tab === "core"
              ? "bg-white text-slate-950 shadow-sm"
              : "text-slate-200 hover:bg-white/10 hover:text-white"
          )}
          onClick={() => setTab("core")}
        >
          Core Benefits
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "growth"}
          className={cn(
            "rounded-xl px-4 py-2 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300",
            tab === "growth"
              ? "bg-white text-slate-950 shadow-sm"
              : "text-slate-200 hover:bg-white/10 hover:text-white"
          )}
          onClick={() => setTab("growth")}
        >
          Growth &amp; Transformation
        </button>
      </div>

      <div
        className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        role="tabpanel"
        aria-label={tab === "core" ? "Core Benefits" : "Growth & Transformation"}
      >
        {items.map((it) => (
          <div
            key={it.title}
            className="group rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-black/20 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-200/30 hover:bg-white/7 hover:shadow-[0_28px_90px_-22px_rgba(34,211,238,0.45)]"
          >
            <h3 className="text-lg font-extrabold text-white">{it.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              {it.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

