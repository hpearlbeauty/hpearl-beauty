"use client";
import { useId, useState } from "react";
import type { CurriculumDay } from "@/content/types";

/**
 * Accordion: aria-expanded buttons, plus icon rotating 45°, 320ms height+opacity transition.
 * Uses grid-template-rows 0fr→1fr so the height is measured by CSS (no content jump).
 */
export function AcademyCurriculum({ days }: { days: readonly CurriculumDay[] }) {
  const [open, setOpen] = useState<number | null>(days[0]?.day ?? null);
  const base = useId();
  return (
    <div className="mt-6 divide-y divide-border border-y border-border">
      {days.map((d) => {
        const isOpen = open === d.day;
        const id = `${base}-${d.day}`;
        return (
          <div key={d.day}>
            <h4>
              <button type="button" aria-expanded={isOpen} aria-controls={id} onClick={() => setOpen((o) => (o === d.day ? null : d.day))} className="flex w-full items-center justify-between gap-6 py-6 text-left">
                <span className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
                  <span className="t-label text-clay">Day {d.day}</span>
                  <span className="t-h3 text-ink">{d.title}</span>
                </span>
                <svg className="menu-icon shrink-0" data-open={isOpen} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </h4>
            <div
              id={id}
              aria-hidden={!isOpen}
              className="grid transition-[grid-template-rows,opacity] duration-[320ms] ease-enter"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr", opacity: isOpen ? 1 : 0 }}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="pb-7">
                  <p className="t-lead text-taupe">{d.summary}</p>
                  <ul className="t-small mt-3 flex flex-wrap gap-2 text-ink">
                    {d.topics.map((t) => (
                      <li key={t} className="rounded-full border border-border px-3 py-1">{t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
