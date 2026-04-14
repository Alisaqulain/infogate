import { cn } from "@/lib/utils";

type BackdropTone = "light" | "deep";

const blob = (className: string) => (
  <div
    className={cn(
      "pointer-events-none absolute rounded-full blur-3xl",
      className,
    )}
    aria-hidden
  />
);

const waveTop = () => (
  <svg
    className="pointer-events-none absolute -top-px left-0 w-full text-blue-500/15"
    viewBox="0 0 1440 120"
    preserveAspectRatio="none"
    aria-hidden
  >
    <path
      fill="currentColor"
      d="M0,64 C180,20 360,100 540,56 C720,12 900,92 1080,48 C1260,4 1380,40 1440,24 L1440,0 L0,0 Z"
    />
  </svg>
);

const waveBottom = (tone: BackdropTone) => (
  <svg
    className={cn(
      "pointer-events-none absolute -bottom-px left-0 w-full",
      tone === "light" ? "text-blue-600/10" : "text-cyan-400/20",
    )}
    viewBox="0 0 1440 100"
    preserveAspectRatio="none"
    aria-hidden
  >
    <path
      fill="currentColor"
      d="M0,32 C200,88 400,8 600,52 C800,96 1000,16 1200,60 C1320,88 1400,40 1440,48 L1440,100 L0,100 Z"
    />
  </svg>
);

const arcHint = () => (
  <svg
    className="pointer-events-none absolute -right-24 top-1/2 h-[min(420px,55vw)] w-[min(420px,55vw)] -translate-y-1/2 text-blue-500/20"
    viewBox="0 0 200 120"
    aria-hidden
  >
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="10"
      strokeLinecap="round"
      d="M20 100 Q100 10 180 100"
    />
    <circle cx="50" cy="78" r="12" fill="currentColor" opacity="0.35" />
    <circle cx="100" cy="38" r="12" fill="currentColor" opacity="0.45" />
    <circle cx="150" cy="78" r="12" fill="currentColor" opacity="0.35" />
  </svg>
);

export function SectionBackdrop({
  tone = "light",
  className,
}: {
  tone?: BackdropTone;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
      aria-hidden
    >
      {waveTop()}
      {blob(
        cn(
          "-left-20 top-10 h-72 w-72",
          tone === "light"
            ? "bg-gradient-to-br from-cyan-400/25 to-blue-600/20"
            : "bg-gradient-to-br from-blue-500/30 to-cyan-300/15",
        ),
      )}
      {blob(
        cn(
          "right-0 top-1/3 h-96 w-96 -translate-y-1/4 translate-x-1/4",
          tone === "light"
            ? "bg-gradient-to-bl from-blue-500/20 to-indigo-600/15"
            : "bg-gradient-to-bl from-blue-400/25 to-slate-900/0",
        ),
      )}
      {blob(
        cn(
          "bottom-0 left-1/3 h-80 w-80 -translate-x-1/2 translate-y-1/3",
          "bg-gradient-to-tr from-sky-400/20 to-blue-700/15",
        ),
      )}
      {arcHint()}
      {waveBottom(tone)}
    </div>
  );
}
