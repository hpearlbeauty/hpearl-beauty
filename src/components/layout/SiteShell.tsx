import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { Footer } from "./Footer";

/** Standard page chrome. `overlayHeader` for pages that open on a dark hero. */
export function SiteShell({ children, overlayHeader = false }: { children: ReactNode; overlayHeader?: boolean }) {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-button focus:bg-ivory focus:px-4 focus:py-2 focus:text-ink">
        Skip to content
      </a>
      <SiteHeader overlay={overlayHeader} />
      <main id="main" className={overlayHeader ? "" : "pt-[68px] lg:pt-[80px]"}>
        {children}
      </main>
      <Footer />
    </>
  );
}
