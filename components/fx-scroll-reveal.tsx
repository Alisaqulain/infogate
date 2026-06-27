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

function collectRevealTargets(root: Document | ParentNode) {
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
  return Array.from(uniq).filter((el) => {
    if (el.getAttribute("data-fx-reveal") === "off") return false;
    if (el.closest('[data-fx-reveal="off"]')) return false;
    if (el.closest("header") && !el.classList.contains("fx-btn")) return false;
    return true;
  });
}

export function FxScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    // Registration pages use Next.js Image components — skip reveal to avoid hydration crashes.
    if (pathname?.includes("/registration")) return;

    let cancelled = false;
    let io: IntersectionObserver | null = null;
    let idleId: number | undefined;
    let timerId: number | undefined;
    let revealIndex = 0;

    const observe = (el: HTMLElement) => {
      applyReveal(el, pickFrom(revealIndex++));
      io?.observe(el);
    };

    const setup = () => {
      if (cancelled) return;

      io?.disconnect();
      revealIndex = 0;

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

      for (const el of collectRevealTargets(document)) observe(el);
    };

    const scheduleSetup = () => {
      // Defer past selective hydration — layout effects can run before streamed
      // or dynamically imported sections (e.g. PhilosophySlider) have hydrated.
      timerId = window.setTimeout(setup, 0);
    };

    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(scheduleSetup, { timeout: 500 });
    } else {
      scheduleSetup();
    }

    const main = document.querySelector("main");
    let mo: MutationObserver | undefined;
    if (main) {
      mo = new MutationObserver(() => {
        if (cancelled || !io) return;
        for (const el of collectRevealTargets(main)) {
          if (el.getAttribute("data-fx-reveal-init") === "1") continue;
          observe(el);
        }
      });
      mo.observe(main, { childList: true, subtree: true });
    }

    return () => {
      cancelled = true;
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timerId !== undefined) window.clearTimeout(timerId);
      mo?.disconnect();
      io?.disconnect();
    };
  }, [pathname]);

  return null;
}
