"use client";
import { ReactLenis, type LenisRef } from "lenis/react";
import { useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/motion/gsap";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";

/**
 * Lenis smooth scroll driven by GSAP's ticker so ScrollTrigger and Lenis share a frame.
 * Disabled entirely under prefers-reduced-motion (native scroll).
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    if (reduced) return;
    const update = (time: number) => lenisRef.current?.lenis?.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    lenisRef.current?.lenis?.on("scroll", ScrollTrigger.update);
    ScrollTrigger.refresh();
    return () => gsap.ticker.remove(update);
  }, [reduced]);

  if (reduced) return <>{children}</>;
  return (
    <ReactLenis root ref={lenisRef} options={{ lerp: 0.09, duration: 1.2, syncTouch: false, autoRaf: false, anchors: true }}>
      {children}
    </ReactLenis>
  );
}
