"use client";

/**
 * Screening checkbox — full-width card, 48px+ target, visible checked state (fill 140ms).
 * Native input kept for keyboard + AT; label wraps the whole card.
 */
export function CheckboxCard({ id, label, checked, onChange }: { id: string; label: string; checked: boolean; onChange: (next: boolean) => void }) {
  return (
    <label
      htmlFor={id}
      className={`group flex min-h-[68px] cursor-pointer items-center gap-4 rounded-control border bg-ivory px-5 py-4 transition-[border-color,background-color] duration-[160ms] ease-micro has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-champagne ${
        checked ? "border-clay bg-sand/50" : "border-border hover:border-taupe/60"
      }`}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={`grid size-5 shrink-0 place-items-center rounded-[5px] border transition-[background-color,border-color] duration-[140ms] ease-micro ${
          checked ? "border-clay bg-clay" : "border-clay/70 bg-bone"
        }`}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`transition-opacity duration-[140ms] ${checked ? "opacity-100" : "opacity-0"}`}>
          <path d="M2.5 6.2 5 8.5l4.5-5" stroke="#F6F0E7" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="t-body text-ink">{label}</span>
    </label>
  );
}
