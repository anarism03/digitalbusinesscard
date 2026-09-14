import type { ReactNode } from "react";
import { Typography, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { styles } from "../../styles/shared/PageHeader.styles";

interface Props {
  title: string;
  subtitle?: string;
  extra?: ReactNode;
  back?: boolean;
  className?: string;
}

export default function PageHeader({
  title,
  subtitle,
  extra,
  back,
  className,
}: Props) {
  const navigate = useNavigate();

  return (
    <div
      className={["page-header", className].filter(Boolean).join(" ")}
      style={styles.root}
    >
      <div className="page-header-title" style={styles.titleRow}>
        {back && (
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            size="small"
          />
        )}
        <div>
          <Typography.Title level={4} style={styles.title}>
            {title}
          </Typography.Title>
          {subtitle && (
            <Typography.Text type="secondary" style={styles.subtitle}>
              {subtitle}
            </Typography.Text>
          )}
        </div>
      </div>
      {extra && <div className="page-header-extra">{extra}</div>}
    </div>
  );
}
