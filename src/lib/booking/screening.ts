import type { ScreeningQuestionId } from "@/content/booking";

/**
 * Brief §6 logic gate: ANY selected answer routes to manual WhatsApp consultation.
 * Kept as a pure function so the routing rule is testable and reused server-side.
 */
export function requiresConsultation(selected: readonly ScreeningQuestionId[]): boolean {
  return selected.length > 0;
}
