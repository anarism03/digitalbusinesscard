import { Skeleton } from "antd";
import { styles } from "../../styles/shared/BasicShared.styles";

export default function LoadingSkeleton() {
  return (
    <div className="premium-loading-skeleton" style={styles.loadingSkeleton}>
      <Skeleton active paragraph={{ rows: 6 }} />
    </div>
  );
}
