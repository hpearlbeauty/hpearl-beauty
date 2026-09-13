"use client";
import { Chip } from "@/components/ui/Chip";
import { galleryFilters } from "@/content/gallery";
import type { GalleryCategory } from "@/content/types";

export type FilterId = "all" | GalleryCategory;

export function GalleryFilter({ value, onChange, panelId }: { value: FilterId; onChange: (v: FilterId) => void; panelId: string }) {
  const onKeyDown = (e: React.KeyboardEvent) => {
    const i = galleryFilters.findIndex((f) => f.id === value);
    if (e.key === "ArrowRight") onChange(galleryFilters[(i + 1) % galleryFilters.length].id);
    if (e.key === "ArrowLeft") onChange(galleryFilters[(i - 1 + galleryFilters.length) % galleryFilters.length].id);
  };
  return (
    <div role="tablist" aria-label="Filter transformations" onKeyDown={onKeyDown} className="flex max-w-full gap-1 overflow-x-auto rounded-full border border-border bg-bone p-1 [scrollbar-width:none] md:inline-flex md:w-auto [&::-webkit-scrollbar]:hidden">
      {galleryFilters.map((f) => (
        <Chip key={f.id} id={`filter-${f.id}`} controls={panelId} active={value === f.id} onClick={() => onChange(f.id)}>
          {f.label}
        </Chip>
      ))}
    </div>
  );
}
