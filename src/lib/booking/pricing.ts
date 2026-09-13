import { bookingCopy } from "@/content/booking";

export interface DepositBreakdown {
  /** null when the service price is TBD */
  totalNGN: number | null;
  depositNGN: number | null;
  balanceNGN: number | null;
  depositPercent: number;
}

/** 50% deposit locks the appointment; remainder is paid at the studio (brief §6). */
export function computeDeposit(priceNGN: number | null): DepositBreakdown {
  const pct = bookingCopy.deposit.depositPercent;
  if (priceNGN === null) return { totalNGN: null, depositNGN: null, balanceNGN: null, depositPercent: pct };
  const deposit = Math.round((priceNGN * pct) / 100);
  return { totalNGN: priceNGN, depositNGN: deposit, balanceNGN: priceNGN - deposit, depositPercent: pct };
}

/** Payment providers take the smallest unit (kobo). */
export const toKobo = (ngn: number) => Math.round(ngn * 100);
