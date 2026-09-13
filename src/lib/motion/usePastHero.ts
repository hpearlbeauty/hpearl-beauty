"use client";
import { useSyncExternalStore } from "react";

function subscribe(cb: () => void) {
  window.addEventListener("scroll", cb, { passive: true });
  window.addEventListener("resize", cb);
  return () => { window.removeEventListener("scroll", cb); window.removeEventListener("resize", cb); };
}

/**
 * True once the `#hero-end` sentinel sits above `offset` px from the viewport top.
 * Reads the DOM on every scroll/resize (not IntersectionObserver) so instant jumps
 * such as anchor links or restored scroll positions are never missed. SSR: false.
 */
export function usePastHero(offset = 80): boolean {
  return useSyncExternalStore(
    subscribe,
    () => {
      const el = document.getElementById("hero-end");
      return el ? el.getBoundingClientRect().top < offset : false;
    },
    () => false,
  );
}
