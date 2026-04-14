import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SectionBackdrop } from "@/components/section-backdrop";
import { FxStagger } from "@/components/fx-stagger";

type Tone = "light" | "deep";

export function Section({
  id,
  children,
  className,
  innerClassName,
  tone = "light",
  as: Tag = "section",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  tone?: Tone;
  as?: "section" | "div";
}) {
  const Comp = Tag;
  return (
    <Comp
      id={id}
      className={cn(
        "fx-section relative overflow-hidden",
        tone === "light" ? "bg-slate-50/80" : "bg-slate-950 text-white",
        className,
      )}
    >
      <SectionBackdrop tone={tone} />
      <FxStagger
        className={cn(
          "relative z-10 mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-24",
          innerClassName,
        )}
      >
        {children}
      </FxStagger>
    </Comp>
  );
}
