/*
  Content model — mirrors docs/product-content-brief.md §19.
  Unknown business facts are `null` (rendered as labelled TBD), never guessed.
*/
export type GalleryCategory = "combo-brows" | "ombre-brows" | "microblading";
export type ServiceId = "combo-brows" | "ombre-powder-brows" | "microblading";

export interface ImageAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Service {
  id: ServiceId;
  name: string;
  /** Optional marketing label, e.g. "The Signature Look". */
  label?: string;
  description: string;
  durationMinutes: number;
  durationLabel: string;
  audience: string;
  /** Short skin-fit label for compact cards (Figma), derived from `audience`. */
  audienceShort: string;
  /** Price in NGN. `null` = TBD (brief §5) — never infer. */
  priceNGN: number | null;
  galleryCategory: GalleryCategory;
  image: ImageAsset;
}

export interface TransformationPair {
  id: string;
  category: GalleryCategory;
  /** Both must be verified hpearl-owned matching images. `null` = placeholder. */
  before: ImageAsset | null;
  after: ImageAsset | null;
  caption?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  source: "google" | "instagram" | "whatsapp";
}

export interface CurriculumDay {
  day: number;
  title: string;
  summary: string;
  topics: string[];
}
