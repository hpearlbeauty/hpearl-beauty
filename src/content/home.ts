/*
  Homepage copy. Business facts come from the brief (§4); layout copy that only
  exists in the Figma frames is marked "Figma".
*/
export const home = {
  hero: {
    eyebrow: "Precision Brow Artistry · Ikeja, Lagos",
    /** Brief §4 H1. Split into lines for the line-by-line reveal (handoff §6). Breaks match the Figma desktop frame. */
    headlineLines: ["Flawless Semi-", "Permanent Brows", "Tailored to Your", "Face."],
    headline: "Flawless Semi-Permanent Brows Tailored to Your Face.",
    /** Brief §4 sub-headline + Figma second sentence. */
    subcopy:
      "Experience the art of precision brow mapping by Olayemi Aluko in Ikeja, Lagos. Designed to look refined, natural and unmistakably yours.",
    primaryCta: "Book Your Consultation & Procedure",
    secondaryCta: "Explore Our Work",
    image: {
      src: "/images/hero/hero-portrait.jpg",
      alt: "hpearl_beauty client in profile with softly defined semi-permanent brows and luminous skin",
      width: 335,
      height: 597,
    },
    /** Hero film — off until visual QA confirms brow fidelity (handoff §12). */
    video: null as null | { src: string; poster: string },
  },
  transformations: {
    title: "Real Transformations",
    supporting: "Precision you can see. Every brow is mapped to your features, skin and desired finish.",
    /** Brief §4 required supporting heading — used as the figure heading. */
    figureHeading: "hpearl_beauty Before and After Transformations",
    figureCaption: "tailored mapping, softer fronts, refined tails",
  },
  services: {
    title: "Our Signature Services",
    viewDetails: "View Details",
  },
  founder: {
    /** Brief §4 required supporting heading. */
    heading: "Professional Eyebrow Studio in Ikeja",
  },
  cta: {
    /** Brief §4 required supporting heading. */
    heading: "Luxury Semi-Permanent Brows in Lagos",
    lead: "Your best brows should still look like you.",
    button: "Book Your Brow Session",
  },
} as const;
