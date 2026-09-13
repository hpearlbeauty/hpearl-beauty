import type { BookingAction, BookingState } from "./types";
import { requiresConsultation } from "./screening";

export const initialBookingState: BookingState = {
  step: "screening",
  screening: [],
  screeningPassed: false,
  serviceId: null,
  date: null,
  slot: null,
  customer: { name: "", phone: "", email: "" },
  reference: null,
  paymentStatus: "idle",
};

/** Pure reducer — the visual flow is driven entirely by this so backends can hydrate it later. */
export function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case "TOGGLE_SCREENING": {
      const has = state.screening.includes(action.id);
      const screening = has ? state.screening.filter((x) => x !== action.id) : [...state.screening, action.id];
      // Leaving consultation_required when the last flag is cleared keeps the CTA honest.
      const step = state.step === "consultation_required" && !requiresConsultation(screening) ? "screening" : state.step;
      return { ...state, screening, screeningPassed: false, step };
    }
    case "SUBMIT_SCREENING":
      return requiresConsultation(state.screening)
        ? { ...state, screeningPassed: false, step: "consultation_required" }
        : { ...state, screeningPassed: true, step: "datetime" };
    case "SELECT_SERVICE":
      // Changing service invalidates any chosen slot (durations differ).
      return { ...state, serviceId: action.serviceId, date: null, slot: null };
    case "SELECT_DATE":
      return { ...state, date: action.date, slot: null };
    case "SELECT_SLOT":
      return { ...state, slot: action.slot };
    case "SUBMIT_DATETIME":
      if (!state.serviceId || !state.date || !state.slot) return state;
      return { ...state, step: "deposit" };
    case "SET_CUSTOMER":
      return { ...state, customer: { ...state.customer, ...action.customer } };
    case "PAYMENT_INITIALISED":
      return { ...state, reference: action.reference, paymentStatus: "pending" };
    case "PAYMENT_RESULT":
      return action.status === "success"
        ? { ...state, paymentStatus: "success", step: "confirmation" }
        : { ...state, paymentStatus: "failed" };
    case "GO_TO": {
      // Guard: never allow skipping forward past the screening gate.
      if (action.step !== "screening" && requiresConsultation(state.screening)) return { ...state, step: "consultation_required" };
      if (action.step !== "screening" && action.step !== "consultation_required" && !state.screeningPassed) return { ...state, step: "screening" };
      if (action.step === "deposit" && !(state.serviceId && state.date && state.slot)) return { ...state, step: "datetime" };
      if (action.step === "confirmation" && state.paymentStatus !== "success") return state;
      return { ...state, step: action.step };
    }
    case "RESET":
      return initialBookingState;
    default:
      return state;
  }
}

export function canProceedFromDateTime(s: BookingState): boolean {
  return Boolean(s.serviceId && s.date && s.slot);
}

export function canProceedFromDeposit(s: BookingState): boolean {
  const c = s.customer;
  return Boolean(c.name.trim() && c.phone.trim() && c.email.trim());
}
