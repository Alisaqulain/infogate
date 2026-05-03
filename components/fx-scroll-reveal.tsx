"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const FROM = ["left", "right", "up", "down"] as const;
type From = (typeof FROM)[number];

function pickFrom(i: number): From {
  return FROM[i % FROM.length];
}

function applyReveal(el: HTMLElement, from: From) {
  if (el.getAttribute("data-fx-reveal-init") === "1") return;
  el.setAttribute("data-fx-reveal-init", "1");
  el.setAttribute("data-fx-reveal-in", "0");
  el.setAttribute("data-fx-from", from);
}

export function FxScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    let io: IntersectionObserver | null = null;

    const setup = () => {
      if (cancelled) return;
      const root = document;
      const candidates = Array.from(
        root.querySelectorAll<HTMLElement>(
          [
            "[data-fx-card]",
            "a.fx-btn",
            "button.fx-btn",
            "a.fx-link",
            "main img",
            "main article",
          ].join(","),
        ),
      );

      const tiltCards = Array.from(
        root.querySelectorAll<HTMLElement>(
          '[class*="tilt-card"], .tilt-card, [data-tilt-card]',
        ),
      );

      const uniq = new Set<HTMLElement>([...candidates, ...tiltCards]);
      const elements = Array.from(uniq).filter(Boolean);

      const filtered = elements.filter((el) => {
        if (el.getAttribute("data-fx-reveal") === "off") return false;
        if (el.closest("header") && !el.classList.contains("fx-btn"))
          return false;
        return true;
      });

      filtered.forEach((el, idx) => applyReveal(el, pickFrom(idx)));

      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const el = entry.target as HTMLElement;
            if (el.getAttribute("data-fx-reveal-init") !== "1") continue;
            if (entry.isIntersecting) {
              el.setAttribute("data-fx-reveal-in", "1");
              io?.unobserve(el);
            }
          }
        },
        { root: null, threshold: 0.14, rootMargin: "0px 0px -10% 0px" },
      );

      for (const el of filtered) io.observe(el);
    };

    const useIdle = typeof requestIdleCallback !== "undefined";
    const scheduleId = useIdle
      ? requestIdleCallback(setup, { timeout: 1800 })
      : window.setTimeout(setup, 120);

    return () => {
      cancelled = true;
      io?.disconnect();
      if (useIdle) cancelIdleCallback(scheduleId);
      else window.clearTimeout(scheduleId);
    };
  }, [pathname]);

  return null;
}

