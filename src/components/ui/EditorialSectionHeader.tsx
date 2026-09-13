import type { ReactNode } from "react";
import { TextReveal } from "@/components/motion/TextReveal";
import { FadeUp } from "@/components/motion/FadeUp";

/**
 * Numbered editorial header: hairline, index + eyebrow on one row, then oversized
 * serif heading left and supporting copy on the right column (desktop).
 */
export function EditorialSectionHeader({
  index,
  eyebrow,
  title,
  supporting,
  id,
  tone = "light",
  className = "",
}: {
  index?: string;
  eyebrow?: ReactNode;
  title: ReactNode;
  supporting?: ReactNode;
  id?: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <header className={`${dark ? "hairline-dark" : "hairline"} pt-6 ${className}`}>
      {(index || eyebrow) && (
        <FadeUp className={`flex items-baseline gap-5 ${dark ? "text-champagne" : "text-clay"}`}>
          {index && <span className="t-index">{index}</span>}
          {eyebrow && <span className="t-label">{eyebrow}</span>}
        </FadeUp>
      )}
      <div className="mt-8 grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
        <TextReveal as="h2" id={id} className={`t-h2 lg:col-span-8 ${dark ? "text-ivory" : "text-ink"}`}>
          {title}
        </TextReveal>
        {supporting && (
          <FadeUp as="p" delay={0.15} className={`t-lead max-w-[36ch] lg:col-span-4 lg:pb-2 ${dark ? "text-ivory/70" : "text-taupe"}`}>
            {supporting}
          </FadeUp>
        )}
      </div>
    </header>
  );
}
