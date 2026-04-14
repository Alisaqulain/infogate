"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  maxTiltDeg?: number;
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

export function TiltCard({ children, className, maxTiltDeg = 8 }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [style, setStyle] = useState<CSSProperties>({
    transform: "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)",
  });

  const clamp = useMemo(
    () => (n: number, min: number, max: number) => Math.min(max, Math.max(min, n)),
    [],
  );

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reducedMotion) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rx = clamp((0.5 - py) * (maxTiltDeg * 2), -maxTiltDeg, maxTiltDeg);
    const ry = clamp((px - 0.5) * (maxTiltDeg * 2), -maxTiltDeg, maxTiltDeg);

    setStyle({
      transform: `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`,
      ...( {
        ["--fx-px" as never]: `${Math.round(px * 100)}%`,
        ["--fx-py" as never]: `${Math.round(py * 100)}%`,
      } as CSSProperties ),
    });
  }

  function onLeave() {
    setStyle({
      transform: "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)",
      ...( {
        ["--fx-px" as never]: "50%",
        ["--fx-py" as never]: "50%",
      } as CSSProperties ),
    });
  }

  return (
    <div
      ref={ref}
      data-fx-card="1"
      className={cn(
        "group relative will-change-transform [transform-style:preserve-3d] transition-transform duration-200 ease-out",
        className,
      )}
      style={style}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-200 group-hover:opacity-100",
          "fx-tilt-glare",
        )}
        aria-hidden
      />
      {children}
    </div>
  );
}

