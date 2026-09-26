"use client";
import { useSyncExternalStore } from "react";
type View = "list" | "grid";
const key = "narxnazar-product-view";
const event = "narxnazar-view-change";
let fallback: View = "list";
let storageAvailable = true;
function snapshot(): View {
  if (!storageAvailable) return fallback;
  try {
    return localStorage.getItem(key) === "grid" ? "grid" : "list";
  } catch {
    storageAvailable = false;
    return fallback;
  }
}
function subscribe(notify: () => void) {
  window.addEventListener("storage", notify);
  window.addEventListener(event, notify);
  return () => {
    window.removeEventListener("storage", notify);
    window.removeEventListener(event, notify);
  };
}
export function useProductView() {
  const view = useSyncExternalStore(subscribe, snapshot, () => "list" as View);
  function setView(next: View) {
    fallback = next;
    try {
      localStorage.setItem(key, next);
    } catch {
      storageAvailable = false;
    }
    window.dispatchEvent(new Event(event));
  }
  return [view, setView] as const;
}
