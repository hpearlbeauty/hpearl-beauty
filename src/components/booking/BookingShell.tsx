"use client";
import { Suspense, useSyncExternalStore } from "react";
import { BookingProvider, useBooking } from "./BookingContext";
import { HealthScreeningStep } from "./HealthScreeningStep";
import { DateTimeStep } from "./DateTimeStep";
import { DepositStep } from "./DepositStep";
import { BookingConfirmation } from "./BookingConfirmation";

function Steps() {
  const { state } = useBooking();
  switch (state.step) {
    case "screening":
    case "consultation_required":
      return <HealthScreeningStep />;
    case "datetime":
      return <DateTimeStep />;
    case "deposit":
      return <DepositStep />;
    case "confirmation":
      return <BookingConfirmation />;
  }
}

const noop = () => () => {};

/**
 * The booking state is restored from sessionStorage, so the flow mounts client-only
 * (server renders a quiet ivory shell) to avoid hydration mismatches.
 */
export function BookingShell() {
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  return (
    <main id="main" className="min-h-dvh bg-ivory">
      {mounted ? (
        <Suspense fallback={null}>
          <BookingProvider>
            <Steps />
          </BookingProvider>
        </Suspense>
      ) : null}
    </main>
  );
}
