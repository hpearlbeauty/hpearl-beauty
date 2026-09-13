export type ReminderKind = "deposit_pending" | "appointment_reminder_24h" | "touch_up_reminder_28d";

export interface ReminderRow {
  id: string;
  bookingReference: string;
  kind: ReminderKind;
  sendAt: string;
  status: "pending" | "sent" | "cancelled" | "failed";
  attempts: number;
}

/** Durable delayed-message queue, drained by /api/cron/reminders. */
export interface ReminderQueue {
  schedule(bookingReference: string, kind: ReminderKind, sendAt: Date): Promise<ReminderRow>;
  cancel(bookingReference: string, kind?: ReminderKind): Promise<void>;
  due(now: Date, limit?: number): Promise<ReminderRow[]>;
  /** Pending reminders of a kind due between two instants (dashboard "touch-ups due"). */
  upcoming(kind: ReminderKind, from: Date, to: Date): Promise<ReminderRow[]>;
  markSent(id: string): Promise<void>;
  markFailed(id: string, error: string): Promise<void>;
}
