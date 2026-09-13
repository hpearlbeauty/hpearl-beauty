"use client";

/** Filter chip — ink fill when active, otherwise quiet on bone. 44px min target. */
export function Chip({ active, children, onClick, id, controls }: { active: boolean; children: React.ReactNode; onClick: () => void; id?: string; controls?: string }) {
  return (
    <button
      type="button"
      id={id}
      role="tab"
      aria-selected={active}
      aria-controls={controls}
      tabIndex={active ? 0 : -1}
      onClick={onClick}
      className={`h-11 shrink-0 whitespace-nowrap rounded-full px-5 t-small font-semibold transition-[background-color,color] duration-[160ms] ease-micro ${
        active ? "bg-ink text-ivory" : "bg-transparent text-ink hover:bg-sand/50"
      }`}
    >
      {children}
    </button>
  );
}
