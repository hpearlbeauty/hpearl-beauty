import type { ReactNode } from "react";

/**
 * Labelled TBD state. Used wherever the brief marks content as not yet supplied
 * (prices, reviews, before photos). Never styled to look like real content.
 */
export function Placeholder({ label, children, tone = "light", className = "" }: { label: string; children?: ReactNode; tone?: "light" | "dark"; className?: string }) {
  const dark = tone === "dark";
  return (
    <div
      role="note"
      className={`rounded-control border border-dashed px-4 py-3 t-small ${dark ? "border-ivory/25 text-ivory/70" : "border-border text-taupe"} ${className}`}
    >
      <span className={`t-label mr-2 ${dark ? "text-champagne" : "text-clay"}`}>TBD</span>
      <span className="font-medium">{label}</span>
      {children ? <span className="block mt-1">{children}</span> : null}
    </div>
  );
}
