import type { Metadata } from "next";
import { seo } from "@/content/seo";
import { SiteShell } from "@/components/layout/SiteShell";
import { StickyBookBar } from "@/components/layout/StickyBookBar";
import { HeroEditorial } from "@/components/home/HeroEditorial";
import { TransformationGallery } from "@/components/home/TransformationGallery";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { BookingCTA } from "@/components/home/BookingCTA";
import { JsonLd } from "@/lib/seo/JsonLdScript";
import { localBusinessJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: { absolute: seo.home.title },
  description: seo.home.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <SiteShell overlayHeader>
      <JsonLd data={localBusinessJsonLd()} />
      <HeroEditorial />
      <TransformationGallery />
      <ServicesGrid />
      <BookingCTA />
      <StickyBookBar />
    </SiteShell>
  );
}
