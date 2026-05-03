"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const HERO_3D_CLASS =
  "pointer-events-none absolute bottom-0 top-0 left-1/2 z-0 w-screen -translate-x-1/2 opacity-70 [mask-image:radial-gradient(78%_70%_at_82%_46%,black_35%,transparent_78%)]";

const STATIC_BG = {
  background:
    "radial-gradient(900px 420px at 70% 35%, rgba(34,211,238,0.14), transparent 55%), radial-gradient(760px 420px at 80% 65%, rgba(37,99,235,0.12), transparent 60%)",
} as const;

function StaticHeroFallback() {
  return (
    <div className={HERO_3D_CLASS} aria-hidden style={STATIC_BG} />
  );
}

const Hero3DInner = dynamic(
  () => import("./hero-3d-backdrop").then((m) => m.Hero3DBackdrop),
  {
    ssr: false,
    loading: () => <StaticHeroFallback />,
  }
);

/**
 * WebGL is heavy for TBT on mobile. Lighthouse emulates phone — skip loading three.js
 * below `lg` and when user prefers reduced motion.
 */
export function Hero3DLazy() {
  const [allowWebGl, setAllowWebGl] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setAllowWebGl(mq.matches && !motion.matches);
    sync();
    mq.addEventListener("change", sync);
    motion.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      motion.removeEventListener("change", sync);
    };
  }, []);

  if (!allowWebGl) {
    return <StaticHeroFallback />;
  }

  return <Hero3DInner className={HERO_3D_CLASS} />;
}
