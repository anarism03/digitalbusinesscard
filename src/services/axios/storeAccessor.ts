import type { StoreLike } from "../../types";

let storeRef: StoreLike | null = null;

export function injectStore(store: StoreLike): void {
  storeRef = store;
}

export function getStore(): StoreLike | null {
  return storeRef;
}
