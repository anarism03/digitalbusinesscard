import { Progress, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { styles } from "../../../../styles/company-admin/QrParts.styles";

interface EmployeeLimitProgressProps {
  used: number;
  total: number;
}

export default function EmployeeLimitProgress({
  used,
  total,
}: EmployeeLimitProgressProps) {
  const percent = total > 0 ? Math.round((used / total) * 100) : 0;
  const label = `İstifadə: ${used} / ${total}`;
  const color =
    used >= total ? "#ff4d4f" : percent >= 80 ? "#faad14" : "#1e63d6";

  return (
    <div className="flex items-center gap-2 mb-4">
      <Tooltip title={label}>
        <span className="text-sm text-gray-600 whitespace-nowrap flex items-center gap-1">
          <InfoCircleOutlined style={styles.limitIcon} />
          {label}
        </span>
      </Tooltip>
      <Progress
        percent={percent}
        size="small"
        strokeColor={color}
        style={styles.limitProgress}
        showInfo={false}
      />
    </div>
  );
}
