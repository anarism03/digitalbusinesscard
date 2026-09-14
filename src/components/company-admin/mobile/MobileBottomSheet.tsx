import { useRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { Drawer } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useFrameContainer } from "../../layout/FrameContainerContext";
import { styles } from "../../../styles/company-admin/MobileBottomSheet.styles";
import type { MobileBottomSheetProps } from "../../../types";

const SWIPE_CLOSE_THRESHOLD = 60;

export default function MobileBottomSheet({
  open,
  title,
  onClose,
  children,
  footer,
  heightMode = "content",
  rootClassName,
}: MobileBottomSheetProps) {
  const getContainer = useFrameContainer();
  const dragStartY = useRef<number | null>(null);

  const handlePointerDown = (event: ReactPointerEvent) => {
    dragStartY.current = event.clientY;
  };

  const handlePointerUp = (event: ReactPointerEvent) => {
    if (dragStartY.current === null) return;
    const delta = event.clientY - dragStartY.current;
    dragStartY.current = null;
    if (delta > SWIPE_CLOSE_THRESHOLD) onClose();
  };

  return (
    <Drawer
      rootClassName={
        ["cadmin-bottom-sheet", rootClassName].filter(Boolean).join(" ")
      }
      placement="bottom"
      open={open}
      onClose={onClose}
      closable
      closeIcon={<CloseOutlined />}
      title={
        <div
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => {
            dragStartY.current = null;
          }}
        >
          <div className="cadmin-bottom-sheet-handle" style={styles.handle} />
          {title && <div style={styles.title}>{title}</div>}
        </div>
      }
      height={heightMode === "large" ? "88%" : "auto"}
      getContainer={getContainer}
      styles={{
        header: styles.header,
        body: styles.body,
        wrapper: styles.wrapper,
      }}
    >
      <div style={styles.content}>{children}</div>
      {footer && <div style={styles.footer}>{footer}</div>}
    </Drawer>
  );
}
