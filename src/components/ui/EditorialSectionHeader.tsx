import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

/**
 * Asymmetric section header: display heading left, supporting sentence right (desktop),
 * stacked on mobile. Matches the "Real Transformations" composition in Figma.
 */
export function EditorialSectionHeader({
  title,
  supporting,
  eyebrow,
  id,
  tone = "light",
  className = "",
}: {
  title: ReactNode;
  supporting?: ReactNode;
  eyebrow?: ReactNode;
  id?: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <Reveal as="header" className={`grid gap-4 md:grid-cols-12 md:items-end ${className}`}>
      <div className="md:col-span-7">
        {eyebrow ? <p className={`t-label mb-4 ${dark ? "text-champagne" : "text-clay"}`}>{eyebrow}</p> : null}
        <h2 id={id} className={`t-h2 ${dark ? "text-ivory" : "text-ink"}`}>
          {title}
        </h2>
      </div>
      {supporting ? (
        <p className={`t-body max-w-[34ch] md:col-span-4 md:col-start-9 ${dark ? "text-ivory/70" : "text-taupe"}`}>{supporting}</p>
      ) : null}
    </Reveal>
  );
}
