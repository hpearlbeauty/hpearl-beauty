"use client";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

/* Register once, client-side only. Import `gsap` from here everywhere. */
gsap.registerPlugin(ScrollTrigger, SplitText);

export { gsap, ScrollTrigger, SplitText };

/** Shared easing vocabulary (handoff §6): slow, controlled, never springy. */
export const EASE = {
  enter: "expo.out",
  exit: "power2.in",
  scrub: "none",
} as const;
