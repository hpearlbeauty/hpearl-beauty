"use client";
import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/motion/gsap";

/**
 * Subtle scroll-linked drift for framed photography. The inner layer is oversized
 * by `scale` so edges never show. No-op under reduced motion.
 */
export function Parallax({ children, className = "", amount = 8, scale = 1.12 }: { children: ReactNode; className?: string; amount?: number; scale?: number }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!outer.current || !inner.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        inner.current,
        { yPercent: -amount, scale },
        { yPercent: amount, scale, ease: "none", scrollTrigger: { trigger: outer.current, start: "top bottom", end: "bottom top", scrub: true } },
      );
    },
    { scope: outer },
  );

  return (
    <div ref={outer} className={`relative overflow-hidden ${className}`}>
      <div ref={inner} className="absolute inset-0 will-change-transform">
        {children}
      </div>
    </div>
  );
}
