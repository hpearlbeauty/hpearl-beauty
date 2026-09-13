/** Slow tracked-uppercase strip. Pauses on hover and under reduced motion (CSS). */
export function Marquee({ items, tone = "dark" }: { items: readonly string[]; tone?: "dark" | "light" }) {
  const row = items.map((t, i) => (
    <span key={i} className="flex items-center gap-8">
      <span>{t}</span>
      <span aria-hidden="true" className="size-1 rounded-full bg-champagne" />
    </span>
  ));
  return (
    <div className={`marquee overflow-hidden border-y ${tone === "dark" ? "border-border-dark bg-ink text-ivory/80" : "border-border bg-ivory text-ink"}`} aria-label={items.join(", ")}>
      <div className="marquee-track flex w-max gap-8 py-4 t-label">
        {row}
        <span aria-hidden="true" className="flex gap-8">{row}</span>
      </div>
    </div>
  );
}
