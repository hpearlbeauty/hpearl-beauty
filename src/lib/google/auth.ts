import "server-only";
import { createSign } from "node:crypto";

/*
  Google service-account auth without the googleapis SDK: sign a RS256 JWT and
  exchange it for an access token. Share the studio calendar with the service
  account email (Make changes to events) and set:
    GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY (\n-escaped), GOOGLE_CALENDAR_ID
*/
let cache: { token: string; exp: number } | null = null;

const b64url = (s: string | Buffer) => Buffer.from(s).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");

export async function getGoogleAccessToken(scope = "https://www.googleapis.com/auth/calendar"): Promise<string> {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!email || !key) throw new Error("GOOGLE_SERVICE_ACCOUNT_EMAIL / GOOGLE_PRIVATE_KEY not set");
  if (cache && cache.exp > Date.now() + 60_000) return cache.token;

  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = b64url(JSON.stringify({ iss: email, scope, aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600 }));
  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${claims}`);
  const jwt = `${header}.${claims}.${b64url(signer.sign(key))}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: jwt }),
    cache: "no-store",
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`Google token error: ${json.error_description ?? json.error ?? res.statusText}`);
  cache = { token: json.access_token, exp: Date.now() + json.expires_in * 1000 };
  return cache.token;
}
