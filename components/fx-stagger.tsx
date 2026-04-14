"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function FxStagger({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      className={cn("fx-stagger", className)}
      data-fx-stagger={ready ? "in" : "off"}
    >
      {children}
    </div>
  );
}

