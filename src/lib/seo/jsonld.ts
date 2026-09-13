import { brand, founder, studio } from "@/content/studio";
import { services } from "@/content/services";
import { academy } from "@/content/academy";
import { siteConfig } from "@/lib/config";

/** LocalBusiness · no invented ratings, hours or price ranges (brief §14). */
export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: brand.name,
    url: siteConfig.url,
    founder: { "@type": "Person", name: founder.name },
    address: {
      "@type": "PostalAddress",
      streetAddress: "No 3, Olaribiro Street, off Adegbeyemi Street, Alade Bus Stop, Allen",
      addressLocality: "Ikeja",
      addressRegion: "Lagos",
      addressCountry: "NG",
    },
    areaServed: ["Ikeja", "Lagos"],
    ...(studio.hours ? { openingHours: studio.hours } : {}),
  };
}

export function servicesJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: services.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: s.name,
        description: s.description,
        provider: { "@type": "BeautySalon", name: brand.name },
        areaServed: "Lagos",
        // `offers` intentionally omitted while prices are TBD.
      },
    })),
  };
}

export function academyCourseJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "hpearl_beauty Academy · Brow Artistry Masterclass",
    description: academy.subcopy,
    provider: { "@type": "Organization", name: brand.name, sameAs: siteConfig.url },
    hasCourseInstance: { "@type": "CourseInstance", courseMode: "onsite", location: { "@type": "Place", address: studio.address } },
  };
}
