"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

/** Mobile-only slim bottom bar, revealed after the hero (handoff §7). */
export function StickyBookBar({ label = "Book Your Consultation" }: { label?: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const sentinel = document.getElementById("hero-end");
    if (!sentinel) return;
    const io = new IntersectionObserver(([e]) => setShow(e.boundingClientRect.top < 0));
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);
  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-border-dark bg-ink/95 px-4 py-2.5 backdrop-blur-sm transition-[transform,opacity] duration-[250ms] ease-micro lg:hidden ${show ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}
      aria-hidden={!show}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="t-small text-ivory/80">Ikeja, Lagos · by appointment</span>
        <Button href="/book" variant="champagne" className="h-11 px-5 t-small" tabIndex={show ? 0 : -1}>
          {label}
        </Button>
      </div>
    </div>
  );
}
