import Link from "next/link";
import { brand, navigation, studio } from "@/content/studio";
import { siteConfig, whatsappLink } from "@/lib/config";
import { Placeholder } from "@/components/ui/Placeholder";

export function Footer() {
  return (
    <footer className="bg-ink text-ivory">
      <div className="container-editorial grid gap-12 py-16 md:grid-cols-12 lg:py-20">
        <div className="md:col-span-5">
          <p className="font-display text-2xl">{brand.wordmark}</p>
          <p className="t-small mt-3 max-w-[36ch] text-ivory/60">{brand.category} · {brand.city}, {brand.state}</p>
        </div>

        <nav aria-label="Footer" className="md:col-span-3">
          <p className="t-label mb-4 text-champagne">Explore</p>
          <ul className="space-y-3">
            {navigation.primary.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="t-body text-ivory/80 hover:text-ivory">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4">
          <p className="t-label mb-4 text-champagne">Studio</p>
          <address className="t-body not-italic text-ivory/80">
            {studio.addressLines.map((l) => (
              <span key={l} className="block">{l}</span>
            ))}
          </address>
          <div className="mt-5 space-y-3">
            {siteConfig.whatsappNumber ? (
              <a href={whatsappLink("Hello hpearl_beauty, I'd like to ask about booking.")} className="t-body inline-block text-ivory underline-offset-[6px] hover:underline" target="_blank" rel="noopener">
                Message us on WhatsApp
              </a>
            ) : (
              <Placeholder tone="dark" label="WhatsApp number pending" />
            )}
            {!studio.hours && <Placeholder tone="dark" label="Opening days & hours pending" />}
          </div>
        </div>
      </div>
      <div className="rule-dark">
        <div className="container-editorial flex flex-col gap-2 py-6 t-small text-ivory/50 md:flex-row md:justify-between">
          <span>© {new Date().getFullYear()} {brand.name}. All rights reserved.</span>
          <span>{studio.timezoneLabel}</span>
        </div>
      </div>
    </footer>
  );
}
