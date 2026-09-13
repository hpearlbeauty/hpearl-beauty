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
    /** Phone-width label for the same CTA. */
    primaryCtaShort: "Book Consultation",
    secondaryCta: "Explore Our Work",
    secondaryCtaShort: "Our Work",
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
    figureCaption: "Editorial imagery. Verified client before/after pairs will replace these once supplied by the studio.",
  },
  services: {
    eyebrow: "Signature services",
    title: "Brows, makeup, lashes and waxing. One standard of precision.",
    supporting: "Four categories, one studio. Brow treatments start with custom mapping; the difference is how much hair-stroke detail versus soft shading you want.",
    categoriesLabel: "Categories",
    browsTitle: "Three brow finishes",
    viewDetails: "View Details",
  },
  founder: {
    eyebrow: "The studio",
    ghost: "Ikeja",
    /** Brief §4 required supporting heading. */
    heading: "Professional Eyebrow Studio in Ikeja",
    approach: "Mapping first, then technique. Every finish is shaped to the client's features.",
    /** Editorial image (licensed stock); swap for studio photography when supplied. */
    image: {
      src: "/images/editorial/studio-artist.jpg",
      alt: "Brow artist working on a client in profile, editorial image",
      caption: "Editorial image. Studio photography to follow.",
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
  marquee: ["Eyebrow", "Makeup", "Lash", "Body Waxing", "Ikeja, Lagos", "By appointment", "50% deposit locks your slot"],
} as const;
