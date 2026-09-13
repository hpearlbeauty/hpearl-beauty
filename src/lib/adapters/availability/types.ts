import type { ServiceId } from "@/content/types";

export interface Slot {
  /** HH:mm, 24h, Africa/Lagos */
  time: string;
  available: boolean;
}

/**
 * Calendar provider contract. Brief §6: provider is TBD, so the UI talks only to this
 * interface. Swap `mock` for a real implementation (Google Calendar, Cal.com, custom DB)
 * without touching components.
 */
export interface AvailabilityProvider {
  /** ISO dates (YYYY-MM-DD) with at least one open slot in the given month (YYYY-MM). */
  getAvailableDates(serviceId: ServiceId, month: string): Promise<string[]>;
  getSlots(serviceId: ServiceId, date: string): Promise<Slot[]>;
  /** Temporarily reserve a slot while the deposit is being paid. */
  hold(input: { serviceId: ServiceId; date: string; time: string; reference: string }): Promise<{ holdId: string; expiresAt: string }>;
  /** Called from the payment webhook once the deposit is verified. */
  confirm(input: { holdId: string; reference: string }): Promise<void>;
  release(holdId: string): Promise<void>;
}
