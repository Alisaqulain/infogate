"use client";

import dynamic from "next/dynamic";

/** Split below-the-fold bundles so the hero can paint sooner (smaller initial JS). */
export const DeferredPhilosophySlider = dynamic(
  () =>
    import("@/components/philosophy-slider").then((m) => m.PhilosophySlider),
  {
    loading: () => (
      <div
        className="mx-auto min-h-[28rem] max-w-4xl rounded-2xl bg-slate-100/70"
        aria-hidden
      />
    ),
  }
);

export const DeferredWhyInfoGateTabs = dynamic(
  () =>
    import("@/components/why-infogate-tabs").then((m) => m.WhyInfoGateTabs),
  {
    loading: () => (
      <div className="mt-8 min-h-[12rem] rounded-2xl bg-white/5" aria-hidden />
    ),
  }
);
