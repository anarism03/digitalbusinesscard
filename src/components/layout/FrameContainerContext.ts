import { createContext, useContext } from "react";

const FrameContainerContext = createContext<(() => HTMLElement) | null>(null);

export const FrameContainerProvider = FrameContainerContext.Provider;

export function useFrameContainer(): (() => HTMLElement) | undefined {
  return useContext(FrameContainerContext) ?? undefined;
}
