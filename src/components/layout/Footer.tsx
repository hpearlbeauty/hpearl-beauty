import Link from "next/link";
import { brand, navigation, studio } from "@/content/studio";
import { siteConfig, whatsappLink } from "@/lib/config";
import { Placeholder } from "@/components/ui/Placeholder";

export function Footer() {
  return (
    <footer className="grain bg-ink text-ivory">
      <div className="container-editorial pb-10 pt-20 lg:pt-28">
        <p className="font-display text-[clamp(56px,10vw,160px)] leading-[0.9] tracking-tight text-ivory">{brand.wordmark}</p>
        <div className="mt-14 grid gap-12 border-t border-border-dark pt-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="t-label text-champagne">Studio</p>
            <address className="t-body mt-4 not-italic text-ivory/80">
              {studio.addressLines.map((l) => <span key={l} className="block">{l}</span>)}
            </address>
          </div>
          <nav aria-label="Footer" className="md:col-span-3">
            <p className="t-label text-champagne">Explore</p>
            <ul className="mt-4 space-y-2">
              {navigation.primary.map((item) => (
                <li key={item.href}><Link href={item.href} className="font-display text-2xl text-ivory/85 hover:text-ivory">{item.label}</Link></li>
              ))}
            </ul>
          </nav>
          <div className="md:col-span-5 md:pl-6">
            <p className="t-label text-champagne">Contact</p>
            <div className="mt-4 space-y-3">
              {siteConfig.whatsappNumber ? (
                <a href={whatsappLink("Hello hpearl_beauty, I'd like to ask about booking.")} className="t-body inline-block text-ivory underline-offset-[6px] hover:underline" target="_blank" rel="noopener">Message us on WhatsApp</a>
              ) : (
                <Placeholder tone="dark" label="WhatsApp number pending" />
              )}
              {!studio.hours && <Placeholder tone="dark" label="Opening days & hours pending" />}
            </div>
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-2 border-t border-border-dark pt-6 t-small text-ivory/50 md:flex-row md:justify-between">
          <span>© {new Date().getFullYear()} {brand.name}. All rights reserved.</span>
          <span>{studio.timezoneLabel}</span>
        </div>
      </div>
    </footer>
  );
}
