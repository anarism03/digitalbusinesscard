import { Empty } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { strings } from "../../constants/strings";
import { styles } from "../../styles/shared/EmptyState.styles";

interface Props {
  description?: string;
}

export default function EmptyState({ description }: Props) {
  return (
    <div className="premium-empty-state">
      <Empty
        image={
          <div style={styles.emptyStateIconBadge}>
            <InboxOutlined />
          </div>
        }
        description={description ?? strings.common.noData}
      />
    </div>
  );
}
