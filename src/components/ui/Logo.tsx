import Link from "next/link";

/**
 * hpearl_beauty mark: a tapered brow arch over a champagne pearl, with the
 * wordmark set in Cormorant and a tracked "beauty". Tone follows the surface.
 */
export function BrowMark({ className = "", tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  const ink = tone === "light" ? "#F6F0E7" : "#17120F";
  return (
    <svg className={className} viewBox="0 0 40 32" width="40" height="32" fill="none" aria-hidden="true">
      {/* Tapered brow arch: thick at the front, fine at the tail */}
      <path d="M2 24 C 7 10, 17 4, 37 9.5 C 20 8.2, 11 13.5, 4.6 25.4 Z" fill={ink} />
      {/* Pearl */}
      <circle cx="30.5" cy="19.5" r="2.6" fill="#CBA477" />
    </svg>
  );
}

export function Logo({ tone = "light", href = "/", size = "md", className = "" }: { tone?: "light" | "dark"; href?: string; size?: "sm" | "md" | "lg"; className?: string }) {
  const text = tone === "light" ? "text-ivory" : "text-ink";
  const dims = size === "lg" ? { mark: "h-9 w-auto", word: "text-[34px]", sub: "text-[10px]" } : size === "sm" ? { mark: "h-6 w-auto", word: "text-[22px]", sub: "text-[9px]" } : { mark: "h-7 w-auto", word: "text-[27px]", sub: "text-[9.5px]" };
  return (
    <Link href={href} aria-label="hpearl_beauty home" className={`inline-flex items-center gap-2.5 ${text} ${className}`}>
      <BrowMark tone={tone} className={dims.mark} />
      <span className="flex flex-col leading-none">
        <span className={`font-display font-medium tracking-tight ${dims.word}`}>hpearl</span>
        <span className={`mt-0.5 font-sans font-medium uppercase tracking-[0.34em] opacity-80 ${dims.sub}`}>beauty</span>
      </span>
    </Link>
  );
}
