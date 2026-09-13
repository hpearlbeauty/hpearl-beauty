/* Brief §6 · screening, deposit and confirmation copy */
export const screeningQuestions = [
  { id: "pregnant_nursing", label: "Pregnant or nursing" },
  { id: "keloids", label: "History of Keloids or hypertrophic scarring" },
  { id: "blood_thinners_accutane", label: "Taking active blood thinners or Accutane treatments" },
  { id: "previous_pmu", label: "Previous permanent makeup/eyebrow tattoos from another studio" },
] as const;

export type ScreeningQuestionId = (typeof screeningQuestions)[number]["id"];

export const bookingCopy = {
  screening: {
    title: "Health & Safety Screening",
    intro:
      "To ensure beautiful, safe results, please review our mandatory health check. Are you currently experiencing any of the following?",
    continueLabel: "Continue to Date & Time",
    flagged: {
      notice:
        "Based on your selection, we need a manual consultation. Let's talk over WhatsApp to evaluate your options safely.",
      ctaLabel: "Continue on WhatsApp",
      whatsappMessage:
        "Hello hpearl_beauty, I completed the health screening on your website and would like a consultation before booking.",
    },
  },
  datetime: {
    title: "Choose Your Date & Time",
    timezoneCue: "Ikeja, Lagos · WAT",
    continueLabel: "Continue to Deposit",
  },
  deposit: {
    title: "Secure Your Appointment.",
    body:
      "We operate strictly by appointment to maintain our high standard of dedicated, one-on-one luxury care. A 50% deposit is required to lock in your calendar slot. The remaining balance is paid at the studio.",
    emphasis: "A 50% deposit locks your appointment. The remaining balance is paid at the studio.",
    ctaLabel: "Pay 50% Deposit Securely",
    depositPercent: 50,
  },
  confirmation: {
    title: "Your brow session is locked in.",
    whatsappStatusPending: "Your WhatsApp confirmation will arrive shortly.",
    addToCalendarLabel: "Add to calendar",
  },
  /** Brief §17: TBD. Kept `null`, never guessed. */
  calendarProvider: null as string | null,
} as const;

/* Figma booking-frame copy (layout copy, not business facts). */
export const bookingFrames = {
  screening: {
    stepLabel: "Step 1 of 3 · Health & Safety",
    heading: "Before we choose a date…",
    helper: "If you select any item, the next action changes to “Talk to us on WhatsApp”.",
    panel: {
      heading: "Your safety comes before your appointment.",
      body: "A short screening helps us confirm that your skin, healing profile and current treatments are suitable for semi-permanent brow work.",
      note: "Private · professional · reviewed before booking",
    },
  },
  datetime: {
    stepLabel: "Step 2 of 3",
    heading: "Choose your service & time",
    sub: "Select the brow treatment that fits your goal, then choose an available appointment.",
    selectService: "Select a service",
    pickDate: "Pick a date",
    availableTimes: "Available times",
    cta: "Continue to deposit",
  },
  deposit: {
    stepLabel: "Step 3 of 3",
    heading: "Secure your appointment",
    sub: "A 50% deposit locks your selected slot. The remaining balance is paid at the studio.",
    summaryLabel: "Appointment summary",
    checkoutLabel: "Secure checkout",
    checkoutHeading: "Pay securely to lock your slot",
    checkoutBody: "You will be redirected to our secure payment provider. No card details are stored on this site.",
    servicePrice: "Service price",
    depositDue: "Deposit due now",
    depositOfConfirmed: "50% of confirmed price",
    note: "Your slot is only confirmed after successful payment.",
    cta: "Pay 50% deposit",
    providers: "Paystack / Flutterwave",
    terms: "By continuing, you agree to the appointment and deposit policy.",
    priceTbdNotice:
      "Deposit checkout opens once the studio confirms pricing for this service. Send us your chosen date on WhatsApp and we'll hold it for you.",
    priceTbdCta: "Send my request on WhatsApp",
  },
  confirmation: {
    stepLabel: "Appointment confirmed",
    heading: "Your brow transformation is locked in.",
    sub: "We've received your deposit and reserved your appointment.",
    studio: "Studio",
    before: "Before your appointment",
    whatsapp: "Open booking details on WhatsApp",
    calendar: "Add to calendar",
  },
} as const;
