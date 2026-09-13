import { prepInstructions, studio } from "./studio";

/* Brief §9 — automated WhatsApp scripts, verbatim. */
export interface ConfirmationVars {
  clientName: string;
  serviceName: string;
  dateTimeLabel: string;
}

/** Script A — sent after screening passes and 50% deposit succeeds. */
export function bookingConfirmationMessage(v: ConfirmationVars): string {
  return [
    `Hello *${v.clientName}*, your brow transformation is locked in! ✨`,
    ``,
    `We have successfully received your 50% deposit for your *${v.serviceName}* session on *${v.dateTimeLabel}*.`,
    ``,
    `📍 *Studio Location:* ${studio.address}`,
    ``,
    `💡 *Pre-Appointment Instructions:* ${prepInstructions}`,
    ``,
    `We look forward to creating your dream brows!`,
  ].join("\n");
}

/**
 * Script B — sent exactly 28 days after the initial appointment.
 * Brief §9 claim note: "last up to 2 years" is unverified. It is kept behind
 * `includeLongevityClaim` (default false) until hpearl_beauty approves it.
 */
export function touchUpReminderMessage(v: { clientName: string; bookingUrl: string; includeLongevityClaim?: boolean }): string {
  const longevity = v.includeLongevityClaim ? " and ensure your brows last up to 2 years" : "";
  return [
    `Hi *${v.clientName}*, it's been 4 weeks since your signature brow session at hpearl_beauty! 🤍`,
    ``,
    `Your brows should be fully healed by now. To perfect your look, lock in the shape${longevity}, it is time for your mandatory *4–6 week touch-up session*.`,
    ``,
    `Tap this link to claim a priority touch-up time slot automatically: *${v.bookingUrl}*`,
  ].join("\n");
}

export const TOUCH_UP_REMINDER_DAYS = 28;
