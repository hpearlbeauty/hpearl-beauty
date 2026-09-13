import Link from "next/link";

/**
 * hpearl_beauty mark: a tapered brow arch over a champagne pearl, paired with the
 * full "hpearl_beauty" wordmark in Cormorant (same lockup as the footer).
 */
export function BrowMark({ className = "", tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  const ink = tone === "light" ? "#F6F0E7" : "#17120F";
  return (
    <svg className={className} viewBox="0 0 40 32" width="40" height="32" fill="none" aria-hidden="true">
      <path d="M2 24 C 7 10, 17 4, 37 9.5 C 20 8.2, 11 13.5, 4.6 25.4 Z" fill={ink} />
      <circle cx="30.5" cy="19.5" r="2.6" fill="#CBA477" />
    </svg>
  );
}

export function Logo({ tone = "light", href = "/", size = "md", className = "" }: { tone?: "light" | "dark"; href?: string; size?: "sm" | "md" | "lg"; className?: string }) {
  const text = tone === "light" ? "text-ivory" : "text-ink";
  const dims = size === "lg" ? { mark: "h-9", word: "text-[36px]" } : size === "sm" ? { mark: "h-5", word: "text-[22px]" } : { mark: "h-6", word: "text-[26px] lg:text-[28px]" };
  return (
    <Link href={href} aria-label="hpearl_beauty home" className={`inline-flex items-center gap-2.5 ${text} ${className}`}>
      <BrowMark tone={tone} className={`${dims.mark} w-auto shrink-0`} />
      <span className={`font-display font-medium leading-none tracking-tight ${dims.word}`}>hpearl_beauty</span>
    </Link>
  );
}
