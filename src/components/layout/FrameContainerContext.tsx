import { createContext, useContext } from "react";

/* eslint-disable react-refresh/only-export-components */

const FrameContainerContext = createContext<(() => HTMLElement) | null>(null);

export const FrameContainerProvider = FrameContainerContext.Provider;

export function useFrameContainer(): (() => HTMLElement) | undefined {
  return useContext(FrameContainerContext) ?? undefined;
}
