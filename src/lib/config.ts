/*
  Runtime config. Public values are safe for the client (NEXT_PUBLIC_*).
  Secrets are read only inside server-only modules (see adapters/*).
*/
export const siteConfig = {
  name: "hpearl_beauty",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description:
    "Precision semi-permanent brow artistry in Ikeja, Lagos — combo brows, ombre powder brows and microblading.",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  paymentProvider: (process.env.NEXT_PUBLIC_PAYMENT_PROVIDER ?? "paystack") as "paystack" | "flutterwave",
  timezone: "Africa/Lagos",
  timezoneLabel: "Ikeja, Lagos · WAT",
} as const;

/** Build a wa.me deep link with a pre-filled message. */
export function whatsappLink(message: string): string {
  const base = siteConfig.whatsappNumber
    ? `https://wa.me/${siteConfig.whatsappNumber}`
    : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(message)}`;
}
