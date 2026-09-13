import "server-only";
import type { AvailabilityProvider } from "./types";
import { mockAvailability } from "./mock";

export type { AvailabilityProvider, Slot } from "./types";

/** Resolved once per process from AVAILABILITY_PROVIDER. */
export function getAvailabilityProvider(): AvailabilityProvider {
  const provider = process.env.AVAILABILITY_PROVIDER ?? "mock";
  switch (provider) {
    case "mock":
      return mockAvailability;
    // case "api": return apiAvailability; — wire the real calendar backend here
    default:
      throw new Error(`Unknown AVAILABILITY_PROVIDER: ${provider}`);
  }
}
