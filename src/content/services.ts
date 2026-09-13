import type { Service } from "./types";

/* Brief §5 · copy verbatim. Prices are TBD; never infer. */
export const services: Service[] = [
  {
    id: "combo-brows",
    name: "Combo Brows",
    label: "The Signature Look",
    description:
      "The ultimate luxury blend. Combines realistic nano-strokes at the front with a soft gradient powder shading through the body and tail for an effortlessly full, defined look.",
    durationMinutes: 150,
    durationLabel: "2.5 Hours",
    audience: "All skin types, especially clients looking to fix sparse areas or asymmetrical brows.",
    audienceShort: "All skin types",
    priceNGN: null,
    galleryCategory: "combo-brows",
    image: {
      src: "/images/work/combo-result-01.jpg",
      alt: "hpearl_beauty client with freshly completed combo brows: crisp hair strokes at the front blending into soft shading",
      width: 961,
      height: 1280,
    },
  },
  {
    id: "ombre-powder-brows",
    name: "Ombre Powder Brows",
    description:
      "A soft, misty, makeup-like finish that starts lighter at the front of the brow and deepens toward the tail. Creates a beautiful, gradient shadow effect.",
    durationMinutes: 120,
    durationLabel: "2 Hours",
    audience: "Oily skin types or clients who love a daily \"freshly filled\" makeup appearance.",
    audienceShort: "Ideal for oily skin",
    priceNGN: null,
    galleryCategory: "ombre-brows",
    image: {
      src: "/images/work/ombre-result-02.jpg",
      alt: "hpearl_beauty client with soft, evenly shaded ombre powder brows after her session",
      width: 1280,
      height: 974,
    },
  },
  {
    id: "microblading",
    name: "Microblading",
    description:
      "Hyper-realistic, individual hair-like strokes drawn manually into the skin to mimic natural brow hairs.",
    durationMinutes: 120,
    durationLabel: "2 Hours",
    audience: "Normal-to-dry skin profiles looking for subtle, hyper-natural enhancements.",
    audienceShort: "Normal to dry skin",
    priceNGN: null,
    galleryCategory: "microblading",
    image: {
      src: "/images/work/microblading-detail-01.jpg",
      alt: "Close-up of fine, natural hair-stroke brows on an hpearl_beauty client immediately after microblading",
      width: 1280,
      height: 1033,
    },
  },
];

/** Additional pricing · all TBD (brief §5). Only display when confirmed. */
export const additionalPricing = {
  touchUpNGN: null as number | null,
} as const;

export const getService = (id: string) => services.find((s) => s.id === id) ?? null;
