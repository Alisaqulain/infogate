"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

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

type Props = {
  children: ReactNode;
  className?: string;
  strength?: number; // px offset cap
};

export function Magnetic({ children, className, strength = 10 }: Props) {
  const reducedMotion = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const raf = useRef<number | null>(null);
  const target = useRef({ x: 0, y: 0 });

  const [style, setStyle] = useState<CSSProperties>({
    transform: "translate3d(0,0,0)",
  });

  function tick() {
    raf.current = null;
    setStyle({ transform: `translate3d(${target.current.x}px, ${target.current.y}px, 0)` });
  }

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reducedMotion) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;

    target.current.x = Math.max(-strength, Math.min(strength, px * strength * 2));
    target.current.y = Math.max(-strength, Math.min(strength, py * strength * 2));

    if (raf.current == null) raf.current = requestAnimationFrame(tick);
  }

  function onLeave() {
    target.current.x = 0;
    target.current.y = 0;
    if (raf.current == null) raf.current = requestAnimationFrame(tick);
  }

  return (
    <div
      ref={ref}
      className={cn("inline-block transition-transform duration-200 ease-out will-change-transform", className)}
      style={style}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </div>
  );
}

