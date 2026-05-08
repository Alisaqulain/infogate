"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const variants: Variants = {
  initial: { opacity: 0, y: 10, filter: "blur(6px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.42, ease: [0.2, 0.9, 0.2, 1] },
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: "blur(6px)",
    transition: { duration: 0.26, ease: [0.2, 0.9, 0.2, 1] },
  },
};

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

