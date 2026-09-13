import Link from "next/link";

/**
 * hpearl_beauty mark: a tapered brow arch over a champagne pearl, with the
 * wordmark set in Cormorant and a tracked "beauty" beneath. One lockup everywhere.
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

type Size = "sm" | "md" | "lg" | "xl";

const SIZES: Record<Size, { mark: string; word: string; sub: string; gap: string; clear: string }> = {
  sm: { mark: "h-6", word: "text-[22px]", sub: "text-[9px]", gap: "gap-2", clear: "mb-[0.1em]" },
  md: { mark: "h-7", word: "text-[27px]", sub: "text-[9.5px]", gap: "gap-2.5", clear: "mb-[0.1em]" },
  lg: { mark: "h-9", word: "text-[34px]", sub: "text-[10px]", gap: "gap-3", clear: "mb-[0.12em]" },
  /* Footer signature */
  xl: { mark: "h-14 md:h-20 lg:h-28", word: "text-[64px] md:text-[104px] lg:text-[150px]", sub: "text-[13px] md:text-[16px] lg:text-[20px] tracking-[0.5em]", gap: "gap-4 md:gap-6 lg:gap-8", clear: "mb-[0.26em]" },
};

export function Logo({ tone = "light", href = "/", size = "md", className = "" }: { tone?: "light" | "dark"; href?: string; size?: Size; className?: string }) {
  const text = tone === "light" ? "text-ivory" : "text-ink";
  const d = SIZES[size];
  return (
    <Link href={href} aria-label="hpearl_beauty home" className={`inline-flex items-center ${d.gap} ${text} ${className}`}>
      <BrowMark tone={tone} className={`${d.mark} w-auto shrink-0`} />
      <span className="flex flex-col leading-none">
        <span className={`font-display font-medium leading-[0.9] tracking-tight ${d.word} ${d.clear}`}>hpearl</span>
        <span className={`font-sans font-medium uppercase tracking-[0.34em] opacity-80 ${d.sub}`}>beauty</span>
      </span>
    </Link>
  );
}
