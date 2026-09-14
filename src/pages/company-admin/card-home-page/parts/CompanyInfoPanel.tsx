import { useState } from "react";
import {
  BankOutlined,
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
  RightOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import { useMyCompany } from "../../../../hooks/useCompanies";
import { useAssetSrc } from "../../../../hooks/useAssetSrc";
import LoadingSkeleton from "../../../../components/shared/LoadingSkeleton";
import {
  isExternalPublicLink,
  publicLinkHref,
} from "../../../../utils/linkHelpers";
import CompanyShareSheet from "../../shared/CompanyShareSheet";
import { styles } from "../../../../styles/company-admin/CompanyInfoPanel.styles";

export default function CompanyInfoPanel() {
  const { data: company, isLoading } = useMyCompany();
  const logoSrc = useAssetSrc(company?.logoUrl);
  const [shareOpen, setShareOpen] = useState(false);

  if (isLoading) return <LoadingSkeleton />;
  if (!company) return null;

  const emailHref = company.email ? publicLinkHref(`mailto:${company.email}`) : "";
  const emailIsExternal = company.email
    ? isExternalPublicLink(`mailto:${company.email}`)
    : false;

  return (
    <div style={styles.wrap}>
      <div className="premium-card-section" style={styles.hero}>
        <div style={styles.heroCover} />
        <div style={styles.heroBody}>
          <div style={styles.logoWrap}>
            <div style={styles.logoCircle}>
              {logoSrc ? (
                <img src={logoSrc} alt={company.name} style={styles.logoImage} />
              ) : (
                <BankOutlined style={styles.logoFallbackIcon} />
              )}
            </div>
            <button
              type="button"
              className="premium-floating-control"
              style={styles.shareButton}
              aria-label="Şirkəti paylaş"
              onClick={() => setShareOpen(true)}
            >
              <ShareAltOutlined />
            </button>
          </div>
          <h1 style={styles.name}>{company.name}</h1>
          {company.voen && (
            <span style={styles.voenTag}>
              <BankOutlined style={styles.voenTagIcon} />
              VÖEN: {company.voen}
            </span>
          )}
        </div>
      </div>

      <div className="premium-card-section" style={styles.infoList}>
        {company.address && (
          <div style={styles.infoRow}>
            <span style={styles.infoIcon}>
              <EnvironmentOutlined />
            </span>
            <span style={styles.infoText}>{company.address}</span>
          </div>
        )}
        {company.email && (
          <a
            href={emailHref}
            target={emailIsExternal ? "_blank" : undefined}
            rel={emailIsExternal ? "noreferrer" : undefined}
            className="public-card-link"
            style={styles.infoRow}
          >
            <span className="public-card-link-icon" style={styles.infoIcon}>
              <MailOutlined />
            </span>
            <span style={styles.infoText}>{company.email}</span>
            <RightOutlined className="public-card-link-arrow" style={styles.infoArrow} />
          </a>
        )}
        {company.phone && (
          <a href={`tel:${company.phone}`} className="public-card-link" style={styles.infoRow}>
            <span className="public-card-link-icon" style={styles.infoIcon}>
              <PhoneOutlined />
            </span>
            <span style={styles.infoText}>{company.phone}</span>
            <RightOutlined className="public-card-link-arrow" style={styles.infoArrow} />
          </a>
        )}
      </div>

      <CompanyShareSheet
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        company={company}
      />
    </div>
  );
}
