import "server-only";
import type { AvailabilityProvider } from "./types";
import { mockAvailability } from "./mock";
import { googleAvailability } from "./google";

export type { AvailabilityProvider, Slot } from "./types";

/** AVAILABILITY_PROVIDER=google uses the studio's Google Calendar; anything else is the mock. */
export function getAvailabilityProvider(): AvailabilityProvider {
  return (process.env.AVAILABILITY_PROVIDER ?? "mock") === "google" ? googleAvailability : mockAvailability;
}
