import { prepInstructions, studio } from "./studio";

/* Brief §9 · automated WhatsApp scripts, verbatim. */
export interface ConfirmationVars {
  clientName: string;
  serviceName: string;
  dateTimeLabel: string;
}

/** Script A · sent after screening passes and 50% deposit succeeds. */
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
 * Script B · sent exactly 28 days after the initial appointment.
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

/* ---- Operational messages (added for automation; client-facing ones flagged for owner approval) ---- */

/** Client, 24h before the session. NEW COPY: approve before launch. Uses only the confirmed prep instruction. */
export function appointmentReminderMessage(v: { clientName: string; serviceName: string; timeLabel: string }): string {
  return [
    `Hi *${v.clientName}*, a reminder that your *${v.serviceName}* session at hpearl_beauty is tomorrow at *${v.timeLabel}*.`,
    ``,
    `📍 ${studio.address}`,
    ``,
    `💡 ${prepInstructions}`,
  ].join("\n");
}

/** Client, when a deposit was started but not completed. NEW COPY: approve before launch. */
export function depositPendingMessage(v: { clientName: string; serviceName: string; dateTimeLabel: string; resumeUrl: string }): string {
  return [
    `Hi *${v.clientName}*, your *${v.serviceName}* slot on *${v.dateTimeLabel}* is being held for a short time.`,
    ``,
    `Complete your 50% deposit to lock it in: ${v.resumeUrl}`,
  ].join("\n");
}

/** Owner notifications (internal). */
export const ownerMessages = {
  newBooking: (v: { clientName: string; phone: string; serviceName: string; dateTimeLabel: string; reference: string; depositLabel: string }) =>
    [`✅ New booking`, `${v.clientName} · ${v.phone}`, `${v.serviceName}`, `${v.dateTimeLabel}`, `Deposit: ${v.depositLabel}`, `Ref ${v.reference}`].join("\n"),
  consultationRequest: (v: { name: string; phone: string | null; flags: string[] }) =>
    [`⚠️ Consultation needed`, `${v.name}${v.phone ? ` · ${v.phone}` : ""}`, `Flags: ${v.flags.join("; ")}`, `They were routed to WhatsApp instead of payment.`].join("\n"),
  depositAbandoned: (v: { clientName: string; phone: string; serviceName: string; dateTimeLabel: string; reference: string }) =>
    [`⏳ Deposit not completed`, `${v.clientName} · ${v.phone}`, `${v.serviceName} · ${v.dateTimeLabel}`, `Ref ${v.reference}. Nudge sent to client.`].join("\n"),
  dailyDigest: (v: { dateLabel: string; lines: string[] }) =>
    [`📅 Today, ${v.dateLabel}`, ...(v.lines.length ? v.lines : ["No appointments."])].join("\n"),
};
