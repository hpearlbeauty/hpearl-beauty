import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { Placeholder } from "@/components/ui/Placeholder";

export const metadata: Metadata = { title: "Shop", robots: { index: false } };

/** Future-ready route (brief §16). No products, prices or checkout until specified. */
export default function ShopPage() {
  return (
    <SiteShell>
      <section className="bg-ivory section-y min-h-[60vh]">
        <div className="container-editorial max-w-[720px]">
          <p className="t-label text-clay">Shop</p>
          <h1 className="t-h2 mt-6 text-ink">Aftercare essentials, coming soon.</h1>
          <Placeholder label="Products, pricing and checkout not yet specified" className="mt-8" />
        </div>
      </section>
    </SiteShell>
  );
}
