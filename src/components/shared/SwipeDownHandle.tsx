import { useCallback, useEffect, useRef } from "react";
import type { CSSProperties, PointerEvent, ReactNode } from "react";
import { styles } from "../../styles/shared/MobileBottomSheet.styles";

const RETURN_DURATION = 220;
const CLOSE_DURATION = 180;

interface DragVisual {
  panel: HTMLElement;
  translate: string;
  transition: string;
  willChange: string;
}

interface Props {
  children?: ReactNode;
  onClose: () => void;
  titleStyle?: CSSProperties;
  enabled?: boolean;
  open?: boolean;
}

export default function SwipeDownHandle({
  children,
  onClose,
  titleStyle,
  enabled = true,
  open = true,
}: Props) {
  const start = useRef<{
    pointerId: number;
    x: number;
    y: number;
    panel: HTMLElement | null;
  } | null>(null);
  const visual = useRef<DragVisual | null>(null);
  const timer = useRef<number | null>(null);

  const resetVisual = useCallback(() => {
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = null;
    if (!visual.current) return;
    const { panel, translate, transition, willChange } = visual.current;
    panel.style.translate = translate;
    panel.style.transition = transition;
    panel.style.willChange = willChange;
    visual.current = null;
  }, []);

  useEffect(() => {
    if (open) resetVisual();
  }, [open, resetVisual]);

  useEffect(() => () => resetVisual(), [resetVisual]);

  const movePanel = (panel: HTMLElement | null, dy: number) => {
    if (!panel) return;
    panel.style.translate = `0 ${Math.max(0, dy)}px`;
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (
      event.isPrimary === false ||
      (event.pointerType === "mouse" && event.button !== 0)
    )
      return;
    resetVisual();
    const panel = event.currentTarget.closest<HTMLElement>(
      ".ant-drawer-content-wrapper, .ant-modal",
    );
    if (panel) {
      visual.current = {
        panel,
        translate: panel.style.translate,
        transition: panel.style.transition,
        willChange: panel.style.willChange,
      };
      panel.style.transition = "none";
      panel.style.willChange = "translate";
    }
    start.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      panel,
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const gesture = start.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    const dx = event.clientX - gesture.x;
    const dy = event.clientY - gesture.y;
    if (dy > 0 && dy > Math.abs(dx) * 1.25) {
      movePanel(gesture.panel, dy);
    }
  };

  const returnPanel = () => {
    if (!visual.current) return;
    const { panel } = visual.current;
    panel.style.transition = `translate ${RETURN_DURATION}ms cubic-bezier(.22,1,.36,1)`;
    panel.style.translate = "0 0";
    timer.current = window.setTimeout(resetVisual, RETURN_DURATION);
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const gesture = start.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    start.current = null;

    const dx = event.clientX - gesture.x;
    const dy = event.clientY - gesture.y;
    const height = gesture.panel?.getBoundingClientRect().height || 0;
    const closeDistance = Math.min(280, Math.max(100, height * 0.45));
    if (dy < closeDistance || dy <= Math.abs(dx) * 1.25) {
      returnPanel();
      return;
    }

    if (!gesture.panel) {
      onClose();
      return;
    }
    gesture.panel.style.transition = `translate ${CLOSE_DURATION}ms cubic-bezier(.22,1,.36,1)`;
    gesture.panel.style.translate = `0 ${Math.max(height + 32, dy + 120)}px`;
    timer.current = window.setTimeout(() => {
      onClose();
      timer.current = window.setTimeout(resetVisual, 500);
    }, CLOSE_DURATION);
  };

  if (!enabled) return <>{children}</>;

  return (
    <div
      className="cadmin-bottom-sheet-drag-zone"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={(event) => {
        if (start.current?.pointerId !== event.pointerId) return;
        start.current = null;
        returnPanel();
      }}
      style={{ touchAction: "none", userSelect: "none", cursor: "grab" }}
    >
      <div className="cadmin-bottom-sheet-handle" style={styles.handle} />
      {children && <div style={titleStyle}>{children}</div>}
    </div>
  );
}
