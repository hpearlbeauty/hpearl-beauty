export type PaymentProviderId = "paystack" | "flutterwave";

export interface InitializePaymentInput {
  reference: string;
  amountKobo: number;
  currency: "NGN";
  email: string;
  customerName: string;
  phone?: string;
  callbackUrl: string;
  metadata: Record<string, string | number | boolean>;
}

export interface InitializePaymentResult {
  provider: PaymentProviderId;
  reference: string;
  /** Hosted checkout URL the client is redirected to. */
  authorizationUrl: string;
}

export interface VerifyPaymentResult {
  provider: PaymentProviderId;
  reference: string;
  status: "success" | "failed" | "pending";
  amountKobo: number;
  currency: string;
  paidAt?: string;
  raw?: unknown;
}

/**
 * Payment gateway contract. Both Paystack and Flutterwave implement this.
 * Everything here runs server-side only; secrets never reach the client bundle.
 */
export interface PaymentProvider {
  id: PaymentProviderId;
  initialize(input: InitializePaymentInput): Promise<InitializePaymentResult>;
  verify(reference: string): Promise<VerifyPaymentResult>;
  /** Validate an incoming webhook before trusting its payload. */
  verifyWebhook(rawBody: string, headers: Headers): boolean;
  /** Extract the payment reference + status from a verified webhook body. */
  parseWebhook(rawBody: string): { event: string; reference: string | null; status: "success" | "failed" | "other" };
}
