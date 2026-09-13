import type { Service } from "./types";

/* Brief §5 · copy verbatim. Prices are TBD; never infer. */
export const services: Service[] = [
  {
    id: "combo-brows",
    category: "eyebrow",
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
      src: "/images/editorial/combo-finish.jpg",
      alt: "Client smiling after her brows are shaped and shaded, editorial image",
      width: 2000,
      height: 1333,
    },
  },
  {
    id: "ombre-powder-brows",
    category: "eyebrow",
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
      src: "/images/editorial/ombre-finish.jpg",
      alt: "Soft, powder-defined brows being finished with a brow pencil, editorial image",
      width: 2000,
      height: 3000,
    },
  },
  {
    id: "microblading",
    category: "eyebrow",
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
      src: "/images/editorial/microblading-mapping.jpg",
      alt: "Hair-stroke mapping on a brow with a PMU pen, editorial image",
      width: 2000,
      height: 1333,
    },
  },
];

/** Additional pricing · all TBD (brief §5). Only display when confirmed. */
export const additionalPricing = {
  touchUpNGN: null as number | null,
} as const;

export const getService = (id: string) => services.find((s) => s.id === id) ?? null;
