import type { ServiceCategoryId } from "./types";

/*
  Service categories requested by the studio (13 Sep 2026): Eyebrow, Makeup, Lash, Body Waxing.
  Only the Eyebrow menu is confirmed (brief §5). The others show a labelled TBD state and route
  enquiries to WhatsApp until the studio supplies their services, durations and prices.
*/
export interface ServiceCategory {
  id: ServiceCategoryId;
  name: string;
  /** Short, non-claim line under the name. */
  tagline: string;
  /** True when at least one service can be booked online. */
  bookable: boolean;
  enquiryMessage: string;
}

export const categories: ServiceCategory[] = [
  { id: "eyebrow", name: "Eyebrow", tagline: "Combo, ombre powder and microblading.", bookable: true, enquiryMessage: "Hello hpearl_beauty, I'd like to ask about your brow services." },
  { id: "makeup", name: "Makeup", tagline: "Menu and pricing to be confirmed.", bookable: false, enquiryMessage: "Hello hpearl_beauty, I'd like to ask about your makeup services." },
  { id: "lash", name: "Lash", tagline: "Menu and pricing to be confirmed.", bookable: false, enquiryMessage: "Hello hpearl_beauty, I'd like to ask about your lash services." },
  { id: "body-waxing", name: "Body Waxing", tagline: "Menu and pricing to be confirmed.", bookable: false, enquiryMessage: "Hello hpearl_beauty, I'd like to ask about body waxing." },
];

export const getCategory = (id: ServiceCategoryId) => categories.find((c) => c.id === id)!;
