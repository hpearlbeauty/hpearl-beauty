import type { ReactNode } from "react";

/** Small tracked uppercase label (13px, 600, 0.14em) · clay on light, champagne on dark. */
export function Eyebrow({ children, tone = "clay", className = "", as: Tag = "p" }: { children: ReactNode; tone?: "clay" | "champagne"; className?: string; as?: "p" | "span" | "div" }) {
  return <Tag className={`t-label ${tone === "clay" ? "text-clay" : "text-champagne"} ${className}`}>{children}</Tag>;
}
