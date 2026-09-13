"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig, whatsappLink } from "@/lib/config";
import { usePastHero } from "@/lib/motion/usePastHero";

/**
 * Mobile-only slim bottom bar (handoff §7): one 48px row with the booking CTA and a
 * WhatsApp icon button, revealed after the hero. Replaces the floating WhatsApp pill on phones.
 */
export function StickyBookBar({ label = "Book Your Consultation" }: { label?: string }) {
  const show = usePastHero(0);
  const pathname = usePathname();
  const wa = whatsappLink(`Hello hpearl_beauty, I'd like to ask about booking.${pathname.startsWith("/services") ? " I'm looking at your services." : ""}`);
  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-border-dark bg-ink/95 backdrop-blur-sm transition-[transform,opacity] duration-[250ms] ease-micro lg:hidden ${show ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}
      aria-hidden={!show}
    >
      <div className="flex items-stretch gap-2 px-3 pt-2 pb-[calc(8px+env(safe-area-inset-bottom))]">
        <Link href="/book" tabIndex={show ? 0 : -1} className="flex h-12 flex-1 items-center justify-center rounded-button bg-champagne px-4 text-[15px] font-semibold text-ink">
          {label}
        </Link>
        {(siteConfig.whatsappNumber || process.env.NODE_ENV !== "production") && (
          <a href={wa} target="_blank" rel="noopener" tabIndex={show ? 0 : -1} aria-label="Chat on WhatsApp" className="grid size-12 shrink-0 place-items-center rounded-button border border-champagne/50 text-ivory">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 1.8a8.2 8.2 0 1 1-4.2 15.3l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 0 1 12 3.8Zm-3.3 4.4c-.2 0-.5 0-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.2 5 4.4 2.5 1 3 .8 3.5.7.5 0 1.7-.7 2-1.4.2-.7.2-1.2.1-1.4-.1-.1-.3-.2-.6-.3l-2-1c-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.2-.7.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.6-1.1.1-.2 0-.4 0-.5l-1-2.2c-.2-.5-.4-.5-.6-.5h-.6Z" /></svg>
          </a>
        )}
      </div>
    </div>
  );
}
