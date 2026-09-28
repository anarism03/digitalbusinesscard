import { Card, Popconfirm } from "antd";
import {
  BankOutlined,
  CheckOutlined,
  EditOutlined,
  SettingOutlined,
  StopOutlined,
} from "@ant-design/icons";
import AssetAvatar from "../../../../components/shared/AssetAvatar";
import type { Company } from "../../../../types";
import { styles } from "../../../../styles/super-admin/CompanyCard.styles";

interface CompanyCardProps {
  company: Company;
  onEdit: (company: Company) => void;
  onToggleActive: (company: Company) => void;
  onChangeLimit: (company: Company) => void;
  toggleActiveLoading?: boolean;
}

export default function CompanyCard({
  company,
  onEdit,
  onToggleActive,
  onChangeLimit,
  toggleActiveLoading,
}: CompanyCardProps) {
  const used = company.usedCount ?? 0;
  const limit = company.userLimit;
  const percent =
    limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;

  return (
    <Card
      style={styles.card}
      styles={{ body: styles.cardBody }}
      onClick={() => onEdit(company)}
    >
      <div style={styles.headerRow}>
        <AssetAvatar
          shape="square"
          size={40}
          src={company.logoUrl}
          name={company.name}
          icon={<BankOutlined style={styles.avatarIcon} />}
          imageStyle={styles.logoImage}
          style={styles.logoAvatar}
        />
        <div style={styles.identityText}>
          <div style={styles.name}>{company.name}</div>
          <div style={styles.voen}>VÖEN {company.voen || "-"}</div>
        </div>
        <span
          style={
            company.isActive
              ? styles.statusPillActive
              : styles.statusPillInactive
          }
        >
          {company.isActive ? "Aktiv" : "Deaktiv"}
        </span>
      </div>

      <div style={styles.limitRow}>
        <span style={styles.limitLabel}>Lisenziya</span>
        <span style={styles.limitValue}>
          {used} / {limit}
        </span>
      </div>
      <div style={styles.progressTrack}>
        <div style={{ ...styles.progressFill, width: `${percent}%` }} />
      </div>

      <div style={styles.actionsRow} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          style={styles.actionButton}
          onClick={() => onEdit(company)}
        >
          <EditOutlined style={styles.actionIcon} />
          <span style={styles.actionLabel}>Redaktə</span>
        </button>
        <button
          type="button"
          style={styles.actionButton}
          onClick={() => onChangeLimit(company)}
        >
          <SettingOutlined style={styles.actionIcon} />
          <span style={styles.actionLabel}>Limit</span>
        </button>
        <Popconfirm
          title={
            company.isActive
              ? "Bu şirkəti deaktivləşdirmək istəyirsiniz?"
              : "Bu şirkəti aktivləşdirmək istəyirsiniz?"
          }
          okText="Bəli"
          cancelText="Xeyr"
          okButtonProps={{
            danger: company.isActive,
            loading: toggleActiveLoading,
          }}
          onConfirm={() => onToggleActive(company)}
        >
          <button
            type="button"
            style={
              company.isActive
                ? { ...styles.actionButton, ...styles.actionButtonDanger }
                : styles.actionButton
            }
          >
            {company.isActive ? (
              <StopOutlined
                style={{ ...styles.actionIcon, ...styles.actionIconDanger }}
              />
            ) : (
              <CheckOutlined style={styles.actionIcon} />
            )}
            <span
              style={
                company.isActive
                  ? { ...styles.actionLabel, ...styles.actionLabelDanger }
                  : styles.actionLabel
              }
            >
              {company.isActive ? "Deaktivləşdir" : "Aktivləşdir"}
            </span>
          </button>
        </Popconfirm>
      </div>
    </Card>
  );
}
