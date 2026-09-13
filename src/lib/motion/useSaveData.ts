"use client";
import { useSyncExternalStore } from "react";

type NavConn = Navigator & { connection?: { saveData?: boolean; addEventListener?: (t: string, cb: () => void) => void; removeEventListener?: (t: string, cb: () => void) => void } };

function subscribe(cb: () => void) {
  const c = (navigator as NavConn).connection;
  c?.addEventListener?.("change", cb);
  return () => c?.removeEventListener?.("change", cb);
}
const get = () => Boolean((navigator as NavConn).connection?.saveData);

/** True when the browser reports Save-Data. SSR-safe (false on server). */
export function useSaveData(): boolean {
  return useSyncExternalStore(subscribe, get, () => false);
}
