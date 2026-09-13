"use client";
import { useId, useMemo, useState } from "react";
import { home } from "@/content/home";
import { transformations } from "@/content/gallery";
import { EditorialSectionHeader } from "@/components/ui/EditorialSectionHeader";
import { FadeUp } from "@/components/motion/FadeUp";
import { GalleryFilter, type FilterId } from "./GalleryFilter";
import { BeforeAfterSlider } from "./BeforeAfterSlider";

export function TransformationGallery() {
  const [filter, setFilter] = useState<FilterId>("all");
  const panelId = useId();
  const pair = useMemo(() => transformations.find((t) => filter === "all" || t.category === filter) ?? null, [filter]);
  const c = home.transformations;

  return (
    <section id="transformations" className="relative overflow-hidden bg-ivory pb-[var(--section-y)] pt-[var(--section-y)] lg:pt-44" aria-labelledby="transformations-heading">
      <span className="ghost right-[-2%] top-[6%] hidden text-ink md:block" aria-hidden="true">{c.ghost}</span>
      <div className="container-editorial relative">
        <EditorialSectionHeader index="01" eyebrow={c.eyebrow} id="transformations-heading" title={c.title} supporting={c.supporting} />

        <FadeUp className="mt-12 lg:mt-16">
          <GalleryFilter value={filter} onChange={setFilter} panelId={panelId} />
        </FadeUp>

        <figure id={panelId} role="tabpanel" aria-labelledby={`filter-${filter}`} className="mt-8">
          <FadeUp y={40}>
            {pair ? (
              <BeforeAfterSlider key={pair.id} pair={pair} />
            ) : (
              <div className="grid aspect-[960/330] place-items-center rounded-frame bg-sand t-small text-taupe">No transformations in this category yet.</div>
            )}
          </FadeUp>
          <figcaption className="mt-6 grid gap-2 md:grid-cols-12">
            <h3 className="t-label text-clay md:col-span-5">{c.figureHeading}</h3>
            <p className="t-small text-taupe md:col-span-5 md:col-start-8">{pair?.caption ?? c.figureCaption}</p>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
