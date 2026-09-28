import type { MutableRefObject } from "react";
import { Spin } from "antd";

interface Props {
  sentinelRef: MutableRefObject<HTMLDivElement | null>;
  isLoadingMore: boolean;
  hasMore: boolean;
}

export default function InfiniteScrollTrigger({
  sentinelRef,
  isLoadingMore,
  hasMore,
}: Props) {
  if (!hasMore) return null;

  return (
    <div
      ref={sentinelRef}
      style={{ display: "flex", justifyContent: "center", padding: 20 }}
    >
      {isLoadingMore && <Spin size="small" />}
    </div>
  );
}
