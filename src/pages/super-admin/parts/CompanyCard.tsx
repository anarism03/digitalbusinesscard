import { Button, Card, Popconfirm, Tag } from "antd";
import {
  BankOutlined,
  CheckOutlined,
  EditOutlined,
  MailOutlined,
  PhoneOutlined,
  SettingOutlined,
  StopOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import AssetAvatar from "../../../components/shared/AssetAvatar";
import { useCompanyLogo } from "../../../hooks/useAssetSrc";
import type { Company } from "../../../types";
import { styles } from "../../../styles/super-admin/CompanyCard.styles";

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
  const { logoSrc } = useCompanyLogo({ logo: company.logoUrl });

  return (
    <Card
      hoverable
      className="company-list-row"
      style={styles.card}
      styles={{ body: styles.cardBody }}
      onClick={() => onEdit(company)}
    >
      <div className="company-list-row__grid" style={styles.grid}>
        <div className="company-list-row__main">
          <div className="company-list-row__identity">
            <AssetAvatar
              shape="square"
              size={56}
              src={logoSrc}
              name={company.name}
              icon={<BankOutlined style={styles.avatarIcon} />}
              imageStyle={styles.logoImage}
              style={styles.logoAvatar}
            />
            <div style={styles.identityText}>
              <div style={styles.name}>
                {company.name}{" "}
                <Tag
                  color={company.isActive ? "success" : "error"}
                  style={{ fontWeight: 400 }}
                >
                  {company.isActive ? "Aktiv" : "Deaktiv"}
                </Tag>
              </div>
              <div style={styles.meta}>
                {company.email && (
                  <span>
                    <MailOutlined /> {company.email}
                  </span>
                )}
                {company.phone && (
                  <span>
                    <PhoneOutlined /> {company.phone}
                  </span>
                )}
              </div>
              {company.address && (
                <div style={styles.address}>{company.address}</div>
              )}
            </div>
          </div>
          <div className="company-list-row__voen">
            <span className="company-list-row__voen-label">VÖEN:</span>
            <span className="company-list-row__voen-value">
              {company.voen || "-"}
            </span>
          </div>
        </div>

        <div
          className="company-list-row__controls"
          style={styles.controls}
          onClick={(e) => e.stopPropagation()}
        >
          <Tag className="company-list-row__limit" color="cyan" style={styles.limitTag}>
            <TeamOutlined style={styles.limitIcon} /> İşçi:{" "}
            {company.usedCount ?? 0} / {company.userLimit}
          </Tag>
          <Button icon={<EditOutlined />} onClick={() => onEdit(company)}>
            Redaktə
          </Button>
          <Button icon={<SettingOutlined />} onClick={() => onChangeLimit(company)}>
            Limit
          </Button>
          <Popconfirm
            title={
              company.isActive
                ? "Bu şirkəti deaktivləşdirmək istəyirsiniz?"
                : "Bu şirkəti aktivləşdirmək istəyirsiniz?"
            }
            okText="Bəli"
            cancelText="Xeyr"
            okButtonProps={{ danger: company.isActive, loading: toggleActiveLoading }}
            onConfirm={() => onToggleActive(company)}
          >
            <Button
              danger={company.isActive}
              icon={company.isActive ? <StopOutlined /> : <CheckOutlined />}
            >
              {company.isActive ? "Deaktivləşdir" : "Aktivləşdir"}
            </Button>
          </Popconfirm>
        </div>
      </div>
    </Card>
  );
}
