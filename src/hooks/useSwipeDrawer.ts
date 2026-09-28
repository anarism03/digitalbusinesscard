import type { PointerEvent as ReactPointerEvent } from "react";
import { useRef } from "react";

export function useSwipeDrawer(
  drawerOpen: boolean,
  onOpen: () => void,
  onClose: () => void,
) {
  const swipeStartRef = useRef<{
    x: number;
    y: number;
    frameLeft: number;
  } | null>(null);

  const handleSwipeStart = (event: ReactPointerEvent) => {
    swipeStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      frameLeft: event.currentTarget.getBoundingClientRect().left,
    };
  };

  const handleSwipeEnd = (event: ReactPointerEvent) => {
    const start = swipeStartRef.current;
    swipeStartRef.current = null;
    if (!start) return;

    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return;

    const startedAtFrameEdge = start.x - start.frameLeft < 40;
    if (!drawerOpen && startedAtFrameEdge && dx > 0) {
      onOpen();
    } else if (drawerOpen && dx < 0) {
      onClose();
    }
  };

  const cancelSwipe = () => {
    swipeStartRef.current = null;
  };

  return { handleSwipeStart, handleSwipeEnd, cancelSwipe };
}
