/* Brief §1, §7, §8, §11, §15 */
export const brand = {
  name: "hpearl_beauty",
  wordmark: "hpearl_beauty",
  category: "Semi-permanent brow studio and PMU training academy",
  city: "Ikeja",
  state: "Lagos",
  country: "Nigeria",
} as const;

export const founder = {
  name: "Olayemi Aluko",
  role: "Brow Artist & Founder",
  location: "Ikeja, Lagos",
  /** Verified bio not yet supplied (brief §11). Temporary sentence approved for interim use. */
  bio: null as string | null,
  interimCopy:
    "Olayemi Aluko brings a detail-led approach to semi-permanent brow artistry, with each treatment shaped around the client's natural features and desired finish.",
} as const;

export const studio = {
  address: "No 3, Olaribiro Street, off Adegbeyemi Street, Alade Bus Stop, Allen, Ikeja, Lagos.",
  addressLines: ["No 3, Olaribiro Street", "off Adegbeyemi Street, Alade Bus Stop", "Allen, Ikeja, Lagos"],
  timezone: "Africa/Lagos",
  timezoneLabel: "Ikeja, Lagos · WAT",
  /** Opening days/hours: TBD (brief §17 #17). */
  hours: null as string | null,
  /** Studio WhatsApp, as shown to clients. The dialable value lives in NEXT_PUBLIC_WHATSAPP_NUMBER. */
  whatsappDisplay: "+234 703 084 7377",
  /** Social handles: TBD (brief §17 #19). */
  instagram: null as string | null,
} as const;

export const prepInstructions =
  "Please avoid alcohol, caffeine, and aspirin for 24 hours before your appointment to ensure optimal pigment retention.";

export const policies = {
  /** TBD (brief §17 #15, #16) */
  cancellation: null as string | null,
  depositRefund: null as string | null,
} as const;

export const navigation = {
  primary: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Academy", href: "/academy" },
    { label: "Book", href: "/book" },
    { label: "Shop", href: "/shop", comingSoon: true },
  ],
  cta: { label: "Book Now", href: "/book" },
} as const;
