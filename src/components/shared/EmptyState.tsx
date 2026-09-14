import { Empty } from "antd";
import { strings } from "../../constants/strings";

interface Props {
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({ description, action }: Props) {
  return (
    <div className="premium-empty-state">
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={description ?? strings.common.noData}
      >
        {action}
      </Empty>
    </div>
  );
}
