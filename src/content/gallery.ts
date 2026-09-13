import type { GalleryCategory, TransformationPair } from "./types";

export const galleryFilters: { id: "all" | GalleryCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "combo-brows", label: "Combo Brows" },
  { id: "ombre-brows", label: "Ombre Brows" },
  { id: "microblading", label: "Microblading" },
];

/*
  Brief §4 / §13: no verified same-client before/after pairs have been supplied yet.
  Until then each pair uses licensed editorial frames of the SAME model, mid-treatment
  on the left and finished on the right (docs/image-credits.md). `before` stays null so
  nothing is presented as a true "before". Verified pairs uploaded in /studio/content
  replace these automatically.
*/
const CAPTION = "Editorial imagery of the same model, mid-treatment and finished. Verified client before/after pairs will replace these once supplied by the studio.";

export const transformations: TransformationPair[] = [
  {
    id: "combo-01",
    category: "combo-brows",
    before: null,
    process: { src: "/images/editorial/combo-process.jpg", alt: "Brow tint being brushed on, eyes closed, editorial image", width: 2000, height: 1333 },
    after: { src: "/images/editorial/combo-finish.jpg", alt: "The same client smiling with finished, defined brows", width: 2000, height: 1333 },
    caption: CAPTION,
  },
  {
    id: "ombre-01",
    category: "ombre-brows",
    before: null,
    process: { src: "/images/editorial/ombre-process-2.jpg", alt: "A fine brush working through the brow, editorial image", width: 2000, height: 1333 },
    after: { src: "/images/editorial/ombre-finish-2.jpg", alt: "The same client smiling with softly shaded, brushed brows", width: 2000, height: 1333 },
    caption: CAPTION,
  },
  {
    id: "micro-01",
    category: "microblading",
    before: null,
    process: { src: "/images/editorial/microblading-mapping-2.jpg", alt: "Fine tool at the brow line of a client lying back with eyes closed, editorial image", width: 2000, height: 1333 },
    after: null,
    caption: "Editorial imagery of hair-stroke mapping. A verified microblading before/after pair will replace this once supplied by the studio.",
  },
];
