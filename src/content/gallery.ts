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
    process: { src: "/images/editorial/ombre-process.jpg", alt: "Brow tint applied with a fine brush, editorial image", width: 2000, height: 3000 },
    after: { src: "/images/editorial/ombre-finish.jpg", alt: "The same client with softly shaded, pencil-defined brows", width: 2000, height: 3000 },
    caption: CAPTION,
  },
  {
    id: "micro-01",
    category: "microblading",
    before: null,
    process: { src: "/images/editorial/microblading-mapping.jpg", alt: "Hair-stroke mapping on a brow with a PMU pen, editorial image", width: 2000, height: 1333 },
    after: null,
    caption: "Editorial imagery of hair-stroke mapping. A verified microblading before/after pair will replace this once supplied by the studio.",
  },
];
