"use client";

import { useSyncExternalStore } from "react";

export type ProductViewMode = "list" | "grid";

const STORAGE_KEY = "narxnazar-product-view";
const CHANGE_EVENT = "narxnazar-view-change";

let fallback: ProductViewMode = "list";
let storageAvailable = true;

function snapshot(): ProductViewMode {
  if (!storageAvailable) return fallback;
  try {
    return localStorage.getItem(STORAGE_KEY) === "grid" ? "grid" : "list";
  } catch {
    storageAvailable = false;
    return fallback;
  }
}

function subscribe(notify: () => void) {
  window.addEventListener("storage", notify);
  window.addEventListener(CHANGE_EVENT, notify);
  return () => {
    window.removeEventListener("storage", notify);
    window.removeEventListener(CHANGE_EVENT, notify);
  };
}

export function useProductView() {
  const view = useSyncExternalStore(subscribe, snapshot, () => "list" as ProductViewMode);

  function setView(next: ProductViewMode) {
    fallback = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      storageAvailable = false;
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }

  return [view, setView] as const;
}
