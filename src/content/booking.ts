/* Brief §6 — screening, deposit and confirmation copy */
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
