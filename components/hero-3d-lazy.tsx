"use client";

import dynamic from "next/dynamic";

const HERO_3D_CLASS =
  "pointer-events-none absolute bottom-0 top-0 left-1/2 z-0 w-screen -translate-x-1/2 opacity-70 [mask-image:radial-gradient(78%_70%_at_82%_46%,black_35%,transparent_78%)]";

const Hero3DInner = dynamic(
  () => import("./hero-3d-backdrop").then((m) => m.Hero3DBackdrop),
  {
    ssr: false,
    loading: () => (
      <div
        className={HERO_3D_CLASS}
        aria-hidden
        style={{
          background:
            "radial-gradient(900px 420px at 70% 35%, rgba(34,211,238,0.14), transparent 55%), radial-gradient(760px 420px at 80% 65%, rgba(37,99,235,0.12), transparent 60%)",
        }}
      />
    ),
  }
);

/** Defers WebGL + three.js until after first paint to improve LCP and TBT. */
export function Hero3DLazy() {
  return <Hero3DInner className={HERO_3D_CLASS} />;
}
