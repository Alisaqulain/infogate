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
    const root = document;
    const candidates = Array.from(
      root.querySelectorAll<HTMLElement>(
        [
          // cards
          "[data-fx-card]",
          // buttons + links
          "a.fx-btn",
          "button.fx-btn",
          "a.fx-link",
          // common media
          "main img",
          "main article",
        ].join(","),
      ),
    );

    // Mark TiltCard wrappers too (best coverage for “cards”)
    const tiltCards = Array.from(
      root.querySelectorAll<HTMLElement>('[class*="tilt-card"], .tilt-card, [data-tilt-card]'),
    );

    const uniq = new Set<HTMLElement>([...candidates, ...tiltCards]);
    const elements = Array.from(uniq).filter(Boolean);

    // Skip header/footer nav links unless they’re fx-btn
    const filtered = elements.filter((el) => {
      if (el.getAttribute("data-fx-reveal") === "off") return false;
      if (el.closest("header") && !el.classList.contains("fx-btn")) return false;
      return true;
    });

    filtered.forEach((el, idx) => applyReveal(el, pickFrom(idx)));

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          if (el.getAttribute("data-fx-reveal-init") !== "1") continue;
          if (entry.isIntersecting) {
            el.setAttribute("data-fx-reveal-in", "1");
            io.unobserve(el);
          }
        }
      },
      { root: null, threshold: 0.14, rootMargin: "0px 0px -10% 0px" },
    );

    for (const el of filtered) io.observe(el);

    return () => io.disconnect();
  }, [pathname]);

  return null;
}

