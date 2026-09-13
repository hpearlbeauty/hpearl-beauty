"use client";
import { useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "@/lib/motion/useReducedMotion";
import { useSaveData } from "@/lib/motion/useSaveData";

/**
 * Hero film: autoplay, muted, loop, playsInline, poster fallback. Poster only for
 * prefers-reduced-motion, Save-Data, or if playback fails (handoff §6 / §9).
 */
export function HeroMedia({ src, poster, alt }: { src: string; poster: string; alt: string }) {
  const reduced = useReducedMotion();
  const saveData = useSaveData();
  const [failed, setFailed] = useState(false);

  if (reduced || saveData || failed) {
    return <Image src={poster} alt={alt} fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />;
  }
  return (
    <>
      <video className="absolute inset-0 size-full object-cover" autoPlay muted loop playsInline poster={poster} preload="metadata" aria-label={alt} onError={() => setFailed(true)}>
        <source src={src.replace(/\.mp4$/, ".webm")} type="video/webm" />
        <source src={src} type="video/mp4" />
      </video>
      <div className="pointer-events-none absolute inset-0 bg-ink/20" aria-hidden="true" />
    </>
  );
}
