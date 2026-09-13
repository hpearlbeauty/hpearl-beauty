import type { GalleryCategory, TransformationPair } from "./types";

export const galleryFilters: { id: "all" | GalleryCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "combo-brows", label: "Combo Brows" },
  { id: "ombre-brows", label: "Ombre Brows" },
  { id: "microblading", label: "Microblading" },
];

/*
  Brief §4 / §13: no verified matching before/after pairs have been supplied yet.
  Each entry keeps `before: null` so the slider renders a labelled placeholder
  instead of mismatching images. Drop verified pairs in and fill both fields.
*/
export const transformations: TransformationPair[] = [
  {
    id: "combo-01",
    category: "combo-brows",
    before: null,
    after: { src: "/images/transformations/combo-brows-01.jpg", alt: "Combo brows result — hpearl_beauty client", width: 335, height: 597 },
  },
  {
    id: "combo-02",
    category: "combo-brows",
    before: null,
    after: { src: "/images/transformations/combo-brows-02.jpg", alt: "Combo brows result during mapping check — hpearl_beauty client", width: 335, height: 597 },
  },
  {
    id: "ombre-01",
    category: "ombre-brows",
    before: null,
    after: { src: "/images/transformations/ombre-brows-01.jpg", alt: "Ombre powder brows result — hpearl_beauty client", width: 335, height: 597 },
  },
  {
    id: "micro-01",
    category: "microblading",
    before: null,
    after: { src: "/images/transformations/microblading-01.jpg", alt: "Microblading result — hpearl_beauty client", width: 335, height: 597 },
  },
];
