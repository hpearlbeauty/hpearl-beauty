"use client";
import { useRef, type ElementType, type ReactNode } from "react";
import { useReveal } from "@/lib/motion/useReveal";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** "image" uses the mask/scale reveal; default is y-24 fade. */
  variant?: "default" | "image";
  /** Stagger offset in ms (cards: 40–60ms per item, max 3 per row). */
  delay?: number;
  id?: string;
};

/** Boundary that activates [data-reveal] descendants. Wrap a section once; children opt in. */
export function RevealScope({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export function Reveal({ as: Tag = "div", children, className, variant = "default", delay = 0, id }: Props) {
  return (
    <Tag
      id={id}
      className={className}
      data-reveal={variant === "image" ? "image" : ""}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
