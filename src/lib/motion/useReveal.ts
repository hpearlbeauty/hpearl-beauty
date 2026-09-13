"use client";
import { useEffect } from "react";

/*
  Scroll reveal (handoff §6 "Scroll Reveals").
  Elements opt in with `data-reveal` (or `data-reveal="image"`).
  Once revealed they stay revealed · never re-animate on re-entry.
  Pure CSS + IntersectionObserver; no animation library.
*/
export function useReveal(root?: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const scope = root?.current ?? document;
    const els = Array.from(scope.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-revealed)"));
    if (els.length === 0) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach((el) => el.classList.add("is-revealed"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-revealed");
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [root]);
}
