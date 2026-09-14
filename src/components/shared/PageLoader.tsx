import { Spin } from "antd";
import { styles } from "../../styles/shared/BasicShared.styles";

export default function PageLoader() {
  return (
    <div className="premium-page-loader" style={styles.pageLoader}>
      <Spin size="large" />
    </div>
  );
}
