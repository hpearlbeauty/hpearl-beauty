import type { GalleryCategory, TransformationPair } from "./types";

export const galleryFilters: { id: "all" | GalleryCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "combo-brows", label: "Combo Brows" },
  { id: "ombre-brows", label: "Ombre Brows" },
  { id: "microblading", label: "Microblading" },
];

/*
  Brief §4 / §13: no verified same-client before/after pairs have been supplied yet.
  Until they are, each entry pairs two genuine hpearl_beauty frames from the studio
  (mapping in progress on the left, finished result on the right) and says so in
  the caption. `before` remains null so nothing is passed off as a true "before".
  When verified pairs arrive, set `before` and the module switches automatically.
*/
export const transformations: TransformationPair[] = [
  {
    id: "combo-01",
    category: "combo-brows",
    before: null,
    process: { src: "/images/transformations/combo-brows-01.jpg", alt: "Mapping in progress on a combo brows client", width: 335, height: 597 },
    after: { src: "/images/work/combo-result-01.jpg", alt: "Finished combo brows on an hpearl_beauty client", width: 961, height: 1280 },
    caption: "Left: mapping in progress at the studio. Right: finished result. Verified before/after pairs to follow.",
  },
  {
    id: "ombre-01",
    category: "ombre-brows",
    before: null,
    process: { src: "/images/transformations/ombre-brows-01.jpg", alt: "Mapping check on an ombre powder brows client", width: 335, height: 597 },
    after: { src: "/images/work/ombre-result-01.jpg", alt: "Soft, evenly shaded ombre powder brows after treatment", width: 959, height: 1280 },
    caption: "Left: mapping check. Right: healed, defined finish. Verified before/after pairs to follow.",
  },
  {
    id: "micro-01",
    category: "microblading",
    before: null,
    process: { src: "/images/transformations/ombre-brows-01.jpg", alt: "Brow mapping with the client in a headband", width: 335, height: 597 },
    after: { src: "/images/work/microblading-detail-01.jpg", alt: "Hair-stroke detail on a microblading client", width: 1280, height: 1033 },
    caption: "Left: mapping. Right: hair-stroke detail. Verified before/after pairs to follow.",
  },
];
