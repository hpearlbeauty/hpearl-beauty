import type { ServiceId } from "@/content/types";

export type BookingStatus = "pending_payment" | "confirmed" | "failed" | "cancelled" | "expired";

export interface BookingRecord {
  reference: string;
  serviceId: ServiceId;
  /** YYYY-MM-DD */
  date: string;
  /** HH:mm */
  time: string;
  customer: { name: string; phone: string; email: string };
  screening: string[];
  holdId: string | null;
  depositKobo: number | null;
  status: BookingStatus;
  paymentProvider: string | null;
  /** Secret for the manage-my-booking link. */
  manageToken: string;
  createdAt: string;
  confirmedAt?: string | null;
  paidAt?: string | null;
}

export interface BookingStore {
  create(record: BookingRecord): Promise<BookingRecord>;
  get(reference: string): Promise<BookingRecord | null>;
  update(reference: string, patch: Partial<BookingRecord>): Promise<BookingRecord | null>;
  /** Unpaid bookings created more than `minutes` ago (for hold expiry / abandoned-deposit nudges). */
  listPendingOlderThan(minutes: number): Promise<BookingRecord[]>;
  listForDate(date: string): Promise<BookingRecord[]>;
  /** Confirmed bookings on or after `fromDate`, soonest first. */
  listUpcoming(fromDate: string, limit?: number): Promise<BookingRecord[]>;
  listByStatus(status: BookingStatus, limit?: number): Promise<BookingRecord[]>;
}
