"use client";
import { useId, useMemo, useState } from "react";
import { home } from "@/content/home";
import { transformations } from "@/content/gallery";
import { EditorialSectionHeader } from "@/components/ui/EditorialSectionHeader";
import { Reveal, RevealScope } from "@/components/ui/Reveal";
import { GalleryFilter, type FilterId } from "./GalleryFilter";
import { BeforeAfterSlider } from "./BeforeAfterSlider";

export function TransformationGallery() {
  const [filter, setFilter] = useState<FilterId>("all");
  const panelId = useId();
  const pair = useMemo(() => transformations.find((t) => filter === "all" || t.category === filter) ?? null, [filter]);
  const { transformations: copy } = home;

  return (
    <RevealScope>
      <section id="transformations" className="bg-ivory section-y" aria-labelledby="transformations-heading">
        <div className="container-editorial">
          <EditorialSectionHeader id="transformations-heading" title={copy.title} supporting={copy.supporting} />

          <Reveal className="mt-12 lg:mt-16">
            <GalleryFilter value={filter} onChange={setFilter} panelId={panelId} />
          </Reveal>

          <figure id={panelId} role="tabpanel" aria-labelledby={`filter-${filter}`} className="mt-8">
            <Reveal variant="image">
              {pair ? (
                <BeforeAfterSlider key={pair.id} pair={pair} />
              ) : (
                <div className="grid aspect-[960/330] place-items-center rounded-frame bg-sand t-small text-taupe">No transformations in this category yet.</div>
              )}
            </Reveal>
            <figcaption className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3 className="t-small font-semibold text-clay">{copy.figureHeading}</h3>
              <span className="t-small text-taupe" aria-hidden="true">•</span>
              <span className="t-small text-taupe">{copy.figureCaption}</span>
            </figcaption>
          </figure>
        </div>
      </section>
    </RevealScope>
  );
}
