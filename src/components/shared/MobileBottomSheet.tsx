import { Drawer } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useFrameContainer } from "../layout/FrameContainerContext";
import { styles } from "../../styles/shared/MobileBottomSheet.styles";
import type { MobileBottomSheetProps } from "../../types";
import SwipeDownHandle from "./SwipeDownHandle";

export default function MobileBottomSheet({
  open,
  title,
  onClose,
  children,
  heightMode = "content",
  rootClassName,
}: MobileBottomSheetProps) {
  const getContainer = useFrameContainer();

  return (
    <Drawer
      rootClassName={["cadmin-bottom-sheet", rootClassName]
        .filter(Boolean)
        .join(" ")}
      placement="bottom"
      open={open}
      onClose={onClose}
      maskClosable
      closable
      closeIcon={<CloseOutlined />}
      title={
        <SwipeDownHandle
          onClose={onClose}
          open={open}
          titleStyle={styles.title}
        >
          {title}
        </SwipeDownHandle>
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
    </Drawer>
  );
}
