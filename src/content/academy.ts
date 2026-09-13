import type { CurriculumDay } from "./types";

/* Brief §10 */
export const academy = {
  eyebrow: "HPEARL BEAUTY ACADEMY",
  /**
   * Brief §10 claim note: "Six-Figure Business" is unsubstantiated concept copy.
   * Handoff §4 supplies the approved alternative; use it until the earnings claim is confirmed.
   */
  headline: "Learn Brow Artistry. Build a Business Around Your Skill.",
  headlineUnconfirmed: "Turn Your Passion for Beauty Into a Six-Figure Business.",
  subcopy:
    "Hands-on mastery under direct guidance from Olayemi Aluko — from colour theory and facial mapping to live model performance.",
  cta: "Reserve Your Academy Seat",
  ctaNote: "Deposit required",
  curriculum: [
    {
      day: 1,
      title: "Foundations",
      summary: "Color Theory, Facial Mapping, and Skin Anatomy.",
      topics: ["Color theory", "Facial mapping", "Skin anatomy"],
    },
    {
      day: 2,
      title: "Hands-On Practice",
      summary: "Hands-on Practice on Artificial Latex and Needle Depth Control.",
      topics: ["Latex practice", "Needle depth control", "Machine control"],
    },
    {
      day: 3,
      title: "Live Model",
      summary: "Live Model Performance under direct guidance from Olayemi Aluko.",
      topics: ["Live model performance", "Guided execution"],
    },
  ] satisfies CurriculumDay[],
  /** Final kit contents TBD (brief §10). Concept items listed for layout only; label as "may include". */
  kitItemsConcept: ["Custom mapping strings", "PMU machines", "Practice latex sheets"],
  kitItemsConfirmed: null as string[] | null,
  tuitionNGN: null as number | null,
  depositNGN: null as number | null,
} as const;
