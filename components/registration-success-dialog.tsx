"use client";

import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { LOGO_SRC, SITE_NAME } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type RegistrationSuccessDialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmLabel: string;
  dir?: "ltr" | "rtl";
};

export function RegistrationSuccessDialog({
  open,
  onClose,
  title,
  message,
  confirmLabel,
  dir = "ltr",
}: RegistrationSuccessDialogProps) {
  const [mounted, setMounted] = useState(false);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open || !mounted) return;
    const t = window.setTimeout(() => confirmRef.current?.focus(), 50);
    return () => window.clearTimeout(t);
  }, [open, mounted]);

  if (!mounted || !open) return null;

  /** Portal + high z-index: PageTransition’s `motion.div` uses transforms, which break `fixed` children. */
  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/55 backdrop-blur-[3px] transition-opacity"
        aria-label="Close"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        dir={dir}
        className={cn(
          "relative z-10 w-full max-w-[420px] overflow-hidden rounded-2xl border border-white/20 bg-white shadow-2xl shadow-blue-950/30 ring-1 ring-blue-500/10 motion-safe:transition motion-safe:duration-200"
        )}
      >
        <div className="relative bg-gradient-to-br from-[#0a192f] via-[#0d2137] to-[#003366] px-6 pb-6 pt-8">
          <div className="pointer-events-none absolute inset-0 opacity-40">
            <div
              className="absolute -start-10 -top-10 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl"
              aria-hidden
            />
            <div
              className="absolute -bottom-8 -end-8 h-32 w-32 rounded-full bg-blue-500/25 blur-3xl"
              aria-hidden
            />
          </div>

          <div className="relative flex flex-col items-center text-center">
            <div className="mb-5 flex h-16 items-center justify-center">
              <Image
                src={LOGO_SRC}
                alt={`${SITE_NAME}`}
                width={200}
                height={80}
                className="h-14 w-auto max-w-[200px] object-contain drop-shadow-md"
                priority
              />
            </div>
            <div className="flex items-center gap-2 text-white">
              <CheckCircle2
                className="h-7 w-7 shrink-0 text-cyan-300"
                strokeWidth={2}
                aria-hidden
              />
              <h2
                id={titleId}
                className="text-xl font-bold tracking-tight sm:text-2xl"
              >
                {title}
              </h2>
            </div>
          </div>
        </div>

        <div className="bg-white px-6 py-6">
          <p className="text-center text-[15px] leading-relaxed text-slate-600">
            {message}
          </p>
          <Button
            ref={confirmRef}
            type="button"
            variant="default"
            size="lg"
            className="mt-6 w-full rounded-xl font-bold"
            onClick={onClose}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
