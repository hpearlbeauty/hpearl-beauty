import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/config";
import { SmoothScroll } from "@/components/motion/SmoothScroll";

/*
  Type system: Cormorant Garamond for display (high-contrast editorial serif),
  Instrument Sans for UI and body. Self-hosted via next/font, swap display.
*/
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display-src",
  display: "swap",
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans-src",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.name, template: `%s · ${siteConfig.name}` },
  description: siteConfig.description,
  openGraph: { type: "website", siteName: siteConfig.name, locale: "en_NG" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#17120F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG" className={`${cormorant.variable} ${instrument.variable}`} suppressHydrationWarning>
      <head>
        {/* Marks JS availability so text-reveal targets can be hidden pre-animation without breaking no-JS rendering. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
