import type { ServiceId } from "@/content/types";
import type { ScreeningQuestionId } from "@/content/booking";

/*
  Booking state model (handoff §10):
  screening -> consultation_required | datetime -> deposit -> confirmation
*/
export type BookingStep = "screening" | "consultation_required" | "datetime" | "deposit" | "confirmation";

export interface Customer {
  name: string;
  phone: string;
  email: string;
}

export interface BookingState {
  step: BookingStep;
  screening: ScreeningQuestionId[];
  serviceId: ServiceId | null;
  /** YYYY-MM-DD in Africa/Lagos */
  date: string | null;
  /** HH:mm 24h */
  slot: string | null;
  customer: Customer;
  /** Payment reference once a deposit has been initialised. */
  reference: string | null;
  /** Set by the payment verify step. */
  paymentStatus: "idle" | "pending" | "success" | "failed";
}

export type BookingAction =
  | { type: "TOGGLE_SCREENING"; id: ScreeningQuestionId }
  | { type: "SUBMIT_SCREENING" }
  | { type: "SELECT_SERVICE"; serviceId: ServiceId }
  | { type: "SELECT_DATE"; date: string }
  | { type: "SELECT_SLOT"; slot: string }
  | { type: "SUBMIT_DATETIME" }
  | { type: "SET_CUSTOMER"; customer: Partial<Customer> }
  | { type: "PAYMENT_INITIALISED"; reference: string }
  | { type: "PAYMENT_RESULT"; status: "success" | "failed" }
  | { type: "GO_TO"; step: BookingStep }
  | { type: "RESET" };

export const STEP_ORDER: BookingStep[] = ["screening", "datetime", "deposit", "confirmation"];

export const STEP_LABELS: Record<Exclude<BookingStep, "consultation_required">, string> = {
  screening: "Health check",
  datetime: "Date & time",
  deposit: "Deposit",
  confirmation: "Confirmed",
};
