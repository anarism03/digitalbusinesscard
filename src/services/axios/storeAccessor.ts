import type { store } from "../../store/store";

let storeRef: typeof store | null = null;

export function injectStore(currentStore: typeof store): void {
  storeRef = currentStore;
}

export function getStore(): typeof store | null {
  return storeRef;
}
