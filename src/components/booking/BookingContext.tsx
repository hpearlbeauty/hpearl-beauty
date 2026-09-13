"use client";
import { createContext, useContext, useEffect, useReducer, useRef, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { bookingReducer, initialBookingState, type BookingAction, type BookingState, type BookingStep } from "@/lib/booking";
import { requiresConsultation } from "@/lib/booking/screening";

const STORAGE_KEY = "hpb.booking.v1";
const VALID: BookingStep[] = ["screening", "consultation_required", "datetime", "deposit", "confirmation"];

const Ctx = createContext<{ state: BookingState; dispatch: React.Dispatch<BookingAction> } | null>(null);

/** Which steps a given state is allowed to show · used to clamp URL-driven navigation. */
function allowedStep(state: BookingState, wanted: BookingStep): BookingStep {
  if (wanted === "screening") return "screening";
  if (requiresConsultation(state.screening)) return "consultation_required";
  if (!state.screeningPassed) return "screening";
  if (wanted === "confirmation") return state.paymentStatus === "success" ? "confirmation" : "deposit";
  if (wanted === "deposit") return state.serviceId && state.date && state.slot ? "deposit" : "datetime";
  return "datetime";
}

export function BookingProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const hydrated = useRef(false);

  const [state, dispatch] = useReducer(bookingReducer, initialBookingState, (init) => {
    if (typeof window === "undefined") return init;
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? { ...init, ...(JSON.parse(raw) as Partial<BookingState>) } : init;
    } catch {
      return init;
    }
  });

  // Honour ?step= on first load, clamped to what the state permits.
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    if (process.env.NODE_ENV === "development" && params.get("preview") === "confirmation") {
      dispatch({ type: "PAYMENT_RESULT", status: "success" });
      return;
    }
    const wanted = params.get("step") as BookingStep | null;
    if (wanted && VALID.includes(wanted)) {
      const target = allowedStep(state, wanted);
      if (target !== state.step) dispatch({ type: "GO_TO", step: target });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist + mirror step into the URL.
  useEffect(() => {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
    const current = params.get("step");
    if (current !== state.step) {
      const next = new URLSearchParams(params.toString());
      next.set("step", state.step);
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    }
  }, [state, params, pathname, router]);

  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>;
}

export function useBooking() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBooking must be used inside BookingProvider");
  return ctx;
}
