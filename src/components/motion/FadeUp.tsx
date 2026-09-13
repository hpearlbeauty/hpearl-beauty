"use client";
import { useRef, type ElementType, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, EASE } from "@/lib/motion/gsap";

/** Scroll-triggered rise for blocks (y 28 → 0, 900ms). Once only. */
export function FadeUp({ as: Tag = "div", children, className = "", delay = 0, y = 28 }: { as?: ElementType; children: ReactNode; className?: string; delay?: number; y?: number }) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (!ref.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(ref.current, { y, autoAlpha: 0, duration: 0.9, ease: EASE.enter, delay, scrollTrigger: { trigger: ref.current, start: "top 90%", once: true } });
    },
    { scope: ref },
  );
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
