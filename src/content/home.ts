/*
  Homepage copy. Business facts come from the brief (§4); everything else is
  layout copy. No em dashes anywhere in rendered text.
*/
export const home = {
  hero: {
    eyebrow: "Precision Brow Artistry · Ikeja, Lagos",
    sideLabel: "Semi-permanent brows · by appointment",
    ghost: "Brows",
    /** Brief §4 H1, split so the accent word can be set in italic champagne. */
    headlineLead: "Flawless Semi-Permanent Brows",
    headlineAccent: "Tailored",
    headlineTail: "to Your Face.",
    headline: "Flawless Semi-Permanent Brows Tailored to Your Face.",
    subcopy:
      "Experience the art of precision brow mapping by Olayemi Aluko in Ikeja, Lagos. Designed to look refined, natural and unmistakably yours.",
    primaryCta: "Book Your Consultation & Procedure",
    secondaryCta: "Explore Our Work",
    /** Editorial portrait (licensed stock, see docs/image-credits.md). Swap for studio photography when supplied. */
    image: {
      src: "/images/editorial/portrait-profile.jpg",
      alt: "Editorial profile portrait of a woman with softly defined brows and luminous skin",
      width: 2000,
      height: 3000,
    },
    /** Hero film stays off until visual QA confirms brow fidelity (handoff §12). */
    video: null as null | { src: string; poster: string },
  },
  transformations: {
    eyebrow: "The work",
    ghost: "After",
    title: "Real Transformations",
    supporting: "Precision you can see. Every brow is mapped to your features, skin and desired finish.",
    /** Brief §4 required supporting heading. */
    figureHeading: "hpearl_beauty Before and After Transformations",
    figureCaption: "Tailored mapping, softer fronts, refined tails.",
  },
  services: {
    eyebrow: "Signature services",
    title: "Three finishes. One standard of precision.",
    supporting: "Each treatment starts with custom mapping. The difference is how much hair-stroke detail versus soft shading you want, and what your skin retains best.",
    viewDetails: "View Details",
  },
  founder: {
    eyebrow: "The studio",
    ghost: "Ikeja",
    /** Brief §4 required supporting heading. */
    heading: "Professional Eyebrow Studio in Ikeja",
    approach: "Mapping first, then technique. Every finish is shaped to the client's features.",
    image: {
      src: "/images/studio/editorial-portrait.jpg",
      alt: "hpearl_beauty client reclining in the studio chair after her brow session",
      caption: "Studio client, Ikeja.",
    },
  },
  cta: {
    eyebrow: "Book",
    ghost: "hpearl",
    /** Brief §4 required supporting heading. */
    heading: "Luxury Semi-Permanent Brows in Lagos",
    lead: "Your best brows should still look like you.",
    button: "Book Your Brow Session",
  },
  marquee: ["Combo Brows", "Ombre Powder Brows", "Microblading", "Ikeja, Lagos", "By appointment", "50% deposit locks your slot"],
} as const;
