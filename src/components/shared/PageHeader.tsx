import type { ReactNode } from "react";
import { Typography, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useTopbarTitle } from "../layout/TopbarTitleContext";
import { styles } from "../../styles/shared/PageHeader.styles";

interface Props {
  title: string;
  extra?: ReactNode;
  back?: boolean;
}

export default function PageHeader({ title, extra, back }: Props) {
  const navigate = useNavigate();
  const hasTopbarProvider = useTopbarTitle(back ? undefined : title);
  const mergedIntoSidebarHeader = hasTopbarProvider && !back;

  if (mergedIntoSidebarHeader) {
    return extra ? (
      <div className="page-header-extra-only" style={styles.extraOnlyRow}>
        {extra}
      </div>
    ) : null;
  }

  return (
    <div className="page-header" style={styles.root}>
      <div className="page-header-title" style={styles.titleRow}>
        {back && (
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            size="small"
          />
        )}
        <Typography.Title level={4} style={styles.title}>
          {title}
        </Typography.Title>
      </div>
      {extra && <div className="page-header-extra">{extra}</div>}
    </div>
  );
}
