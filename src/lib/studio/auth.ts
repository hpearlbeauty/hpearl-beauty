import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/*
  Owner dashboard access: a single passcode (STUDIO_PASSCODE) exchanged for an
  HMAC-signed cookie (STUDIO_SESSION_SECRET). Small-team appropriate; swap for a
  proper auth provider if more staff accounts are needed.
*/
const COOKIE = "hpb_studio";
const secret = () => process.env.STUDIO_SESSION_SECRET ?? process.env.STUDIO_PASSCODE ?? "";
const sign = (v: string) => createHmac("sha256", secret()).update(v).digest("hex");

export function isConfigured(): boolean {
  return Boolean(process.env.STUDIO_PASSCODE);
}

export async function isAuthenticated(): Promise<boolean> {
  if (!isConfigured()) return false;
  const c = (await cookies()).get(COOKIE)?.value;
  if (!c) return false;
  const a = Buffer.from(c), b = Buffer.from(sign("studio"));
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function login(passcode: string): Promise<boolean> {
  const expected = process.env.STUDIO_PASSCODE ?? "";
  const a = Buffer.from(passcode), b = Buffer.from(expected);
  if (!expected || a.length !== b.length || !timingSafeEqual(a, b)) return false;
  (await cookies()).set(COOKIE, sign("studio"), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 30 });
  return true;
}

export async function logout() {
  (await cookies()).delete(COOKIE);
}
