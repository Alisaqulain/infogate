"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold outline-none transition disabled:pointer-events-none disabled:opacity-60 focus-visible:ring-4 focus-visible:ring-blue-500/20",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-600/25 hover:brightness-110",
        secondary:
          "border border-white/15 bg-white/10 text-white backdrop-blur hover:bg-white/15",
        outline:
          "border border-slate-200 bg-white text-slate-900 shadow-sm hover:bg-slate-50 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10",
        ghost: "hover:bg-black/5 dark:hover:bg-white/10",
      },
      size: {
        sm: "h-10 px-4",
        md: "h-11 px-6",
        lg: "h-12 px-8 text-[15px]",
        icon: "h-11 w-11 rounded-full p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

