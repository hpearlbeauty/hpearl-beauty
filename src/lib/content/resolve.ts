import "server-only";
import { getSettings, type SiteSettings } from "./settings";
import { services as defaultServices } from "@/content/services";
import { transformations as defaultPairs } from "@/content/gallery";
import { testimonials as defaultTestimonials } from "@/content/testimonials";
import { academy as defaultAcademy } from "@/content/academy";
import { founder, policies as defaultPolicies, studio } from "@/content/studio";
import type { Service, Testimonial, TransformationPair } from "@/content/types";

export interface SiteContent {
  settings: SiteSettings;
  /** Services with owner-set prices applied. */
  services: Service[];
  touchUpNGN: number | null;
  /** Verified before/after pairs from the editor first, then the code defaults. */
  pairs: TransformationPair[];
  testimonials: Testimonial[];
  founderBio: string | null;
  hoursDisplay: string | null;
  policies: { cancellation: string | null; depositRefund: string | null };
  academy: { headline: string; tuitionNGN: number | null; depositNGN: number | null; kitItems: string[] | null };
  claims: SiteSettings["claims"];
  aftercare: SiteSettings["aftercare"];
  instagram: string | null;
}

/** Single entry point for every page: code defaults merged with the owner's settings. */
export async function getSiteContent(): Promise<SiteContent> {
  const s = await getSettings();
  const services = defaultServices.map((svc) => ({ ...svc, priceNGN: s.pricing[svc.id] ?? svc.priceNGN }));
  const editorPairs: TransformationPair[] = s.gallery.map((g) => ({
    id: g.id,
    category: g.category,
    before: { src: g.beforeUrl, alt: "Before: client brows before treatment at hpearl_beauty", width: 1200, height: 1500 },
    after: { src: g.afterUrl, alt: "After: finished brows at hpearl_beauty", width: 1200, height: 1500 },
    caption: g.caption,
  }));
  return {
    settings: s,
    services,
    touchUpNGN: s.pricing.touchUp,
    pairs: editorPairs.length ? [...editorPairs, ...defaultPairs] : defaultPairs,
    testimonials: s.reviews.length ? s.reviews : defaultTestimonials,
    founderBio: s.founder.bio ?? founder.bio,
    hoursDisplay: s.hours.display ?? studio.hours,
    policies: { cancellation: s.policies.cancellation ?? defaultPolicies.cancellation, depositRefund: s.policies.depositRefund ?? defaultPolicies.depositRefund },
    academy: {
      headline: s.claims.sixFigureApproved ? defaultAcademy.headlineUnconfirmed : defaultAcademy.headline,
      tuitionNGN: s.pricing.academyTuition ?? defaultAcademy.tuitionNGN,
      depositNGN: s.pricing.academyDeposit ?? defaultAcademy.depositNGN,
      kitItems: s.academy.kitItems ?? defaultAcademy.kitItemsConfirmed,
    },
    claims: s.claims,
    aftercare: s.aftercare,
    instagram: s.socials.instagram ?? studio.instagram,
  };
}

/** Studio schedule string: editor setting, else STUDIO_HOURS env, else the placeholder default. */
export async function getScheduleString(): Promise<string | undefined> {
  const s = await getSettings();
  return s.hours.schedule ?? process.env.STUDIO_HOURS;
}
