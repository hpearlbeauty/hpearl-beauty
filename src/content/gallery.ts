import type { GalleryCategory, TransformationPair } from "./types";

export const galleryFilters: { id: "all" | GalleryCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "combo-brows", label: "Combo Brows" },
  { id: "ombre-brows", label: "Ombre Brows" },
  { id: "microblading", label: "Microblading" },
];

/*
  Brief §4 / §13: no verified same-client before/after pairs have been supplied yet.
  These are licensed editorial images (docs/image-credits.md) showing process on the
  left and a finished brow on the right, and the caption says so. `before` stays null
  so nothing is presented as a true "before". Verified pairs uploaded in /studio/content
  replace these automatically.
*/
const CAPTION = "Editorial imagery. Verified client before/after pairs will replace these once supplied by the studio.";

export const transformations: TransformationPair[] = [
  {
    id: "combo-01",
    category: "combo-brows",
    before: null,
    process: { src: "/images/editorial/process-pen-mapping.jpg", alt: "Brow mapping with a measuring pen, editorial image", width: 2000, height: 1333 },
    after: { src: "/images/editorial/portrait-front.jpg", alt: "Editorial portrait with full, defined brows", width: 2000, height: 3000 },
    caption: CAPTION,
  },
  {
    id: "ombre-01",
    category: "ombre-brows",
    before: null,
    process: { src: "/images/editorial/process-tint.jpg", alt: "Brow tint being applied with a fine brush, editorial image", width: 2000, height: 1333 },
    after: { src: "/images/editorial/portrait-three-quarter.jpg", alt: "Editorial portrait with a soft, shaded brow finish", width: 2000, height: 3000 },
    caption: CAPTION,
  },
  {
    id: "micro-01",
    category: "microblading",
    before: null,
    process: { src: "/images/editorial/process-microblading.jpg", alt: "Gloved hands microblading a brow, editorial image", width: 2000, height: 3556 },
    after: { src: "/images/editorial/portrait-half.jpg", alt: "Editorial close-up of a naturally feathered brow", width: 2000, height: 1333 },
    caption: CAPTION,
  },
];
