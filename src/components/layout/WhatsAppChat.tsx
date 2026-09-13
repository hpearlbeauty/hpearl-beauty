"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { siteConfig, whatsappLink } from "@/lib/config";
import { getService } from "@/content/services";
import { usePastHero } from "@/lib/motion/usePastHero";

/**
 * Floating WhatsApp entry point. No third-party widget: a wa.me deep link whose
 * pre-filled message carries page context (service in view, page name).
 * Hidden inside the booking flow (it has its own WhatsApp paths) and until the
 * visitor has left the hero. Sits above the mobile sticky bar.
 */
export function WhatsAppChat() {
  const pathname = usePathname();
  const [hash, setHash] = useState("");
  const show = usePastHero(0);

  useEffect(() => {
    const onHash = () => setHash(window.location.hash.replace("#", ""));
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [pathname]);

  if (pathname.startsWith("/book")) return null;
  if (!siteConfig.whatsappNumber && process.env.NODE_ENV === "production") return null;

  const service = hash ? getService(hash) : null;
  const context = service
    ? `I'm asking about ${service.name}.`
    : pathname.startsWith("/services")
      ? "I'd like help choosing between your brow services."
      : pathname.startsWith("/academy")
        ? "I'm interested in the Academy."
        : "I'd like to ask about booking.";
  const message = `Hello hpearl_beauty, ${context}`;

  return (
    <a
      href={whatsappLink(message)}
      target="_blank"
      rel="noopener"
      aria-label="Chat with hpearl_beauty on WhatsApp"
      title={siteConfig.whatsappNumber ? "Chat on WhatsApp" : "WhatsApp number pending (set NEXT_PUBLIC_WHATSAPP_NUMBER)"}
      className={`fixed right-4 z-30 hidden h-12 items-center gap-2.5 md:flex rounded-full border border-champagne/40 bg-ink/95 pl-3.5 pr-4 text-ivory shadow-[0_8px_30px_rgba(23,18,15,0.25)] backdrop-blur-sm transition-[transform,opacity] duration-[250ms] ease-micro hover:border-champagne lg:right-8 ${
        show ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0 pointer-events-none"
      } bottom-[calc(72px+env(safe-area-inset-bottom))] lg:bottom-8`}
      tabIndex={show ? 0 : -1}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 1.8a8.2 8.2 0 1 1-4.2 15.3l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 0 1 12 3.8Zm-3.3 4.4c-.2 0-.5 0-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.2 5 4.4 2.5 1 3 .8 3.5.7.5 0 1.7-.7 2-1.4.2-.7.2-1.2.1-1.4-.1-.1-.3-.2-.6-.3l-2-1c-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.2-.7.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.6-1.1.1-.2 0-.4 0-.5l-1-2.2c-.2-.5-.4-.5-.6-.5h-.6Z" />
      </svg>
      <span className="t-small font-semibold">WhatsApp</span>
    </a>
  );
}
