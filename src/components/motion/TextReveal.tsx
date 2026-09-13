"use client";
import { useRef, type ElementType, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText, EASE } from "@/lib/motion/gsap";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  id?: string;
  /** ms before the first line moves (hero sequencing). */
  delay?: number;
  /** Animate on load rather than on scroll into view. */
  immediate?: boolean;
  /** Seconds between lines. */
  stagger?: number;
};

/**
 * Line-by-line masked reveal (SplitText, GSAP 3.13+ `mask` + `autoSplit`).
 * Text is hidden only when JS is present (`html.js`), then revealed once.
 * Reduced motion: shown immediately, no split.
 */
export function TextReveal({ as: Tag = "div", children, className = "", id, delay = 0, immediate = false, stagger = 0.08 }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(el, { visibility: "visible" });
        return;
      }
      let split: SplitText | undefined;
      document.fonts.ready.then(() => {
        if (!el.isConnected) return;
        split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          linesClass: "tr-line",
          onSplit(self) {
            gsap.set(el, { visibility: "visible" });
            return gsap.from(self.lines, {
              yPercent: 110,
              duration: 1.1,
              ease: EASE.enter,
              stagger,
              delay: delay / 1000,
              ...(immediate ? {} : { scrollTrigger: { trigger: el, start: "top 88%", once: true } }),
            });
          },
        });
      });
      return () => split?.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} data-text-reveal="" className={className}>
      {children}
    </Tag>
  );
}
