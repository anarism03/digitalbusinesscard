import { useEffect, useState } from "react";
import { Button, message } from "antd";
import {
  BankOutlined,
  CopyOutlined,
  DownloadOutlined,
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
  ShareAltOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";
import MobileBottomSheet from "../../../components/company-admin/mobile/MobileBottomSheet";
import { copyToClipboard } from "../../../utils/feedback";
import { useAssetSrc } from "../../../hooks/useAssetSrc";
import { buildQrBlob, buildQrSvgDataUrl } from "../../../utils/qr";
import { buildCompanyVcfText } from "../../../utils/vcard";
import { triggerBlobDownload } from "../../../utils/download";
import type { Company } from "../../../types";
import { styles } from "../../../styles/company-admin/CompanyShareSheet.styles";

type QrFormat = "png" | "svg";

interface Props {
  open: boolean;
  onClose: () => void;
  company: Company;
}

function buildShareText(company: Company): string {
  return [
    `Şirkət Adı: ${company.name}`,
    company.voen ? `VÖEN: ${company.voen}` : undefined,
    company.address ? `Ünvan: ${company.address}` : undefined,
    company.email ? `Email: ${company.email}` : undefined,
    company.phone ? `Nömrə: ${company.phone}` : undefined,
  ]
    .filter(Boolean)
    .join("\n");
}

export default function CompanyShareSheet({ open, onClose, company }: Props) {
  const logoSrc = useAssetSrc(company.logoUrl);
  const shareText = buildShareText(company);
  const [qrSrc, setQrSrc] = useState("");
  const [qrDownloading, setQrDownloading] = useState(false);
  const [format, setFormat] = useState<QrFormat>("png");
  const canNativeShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  useEffect(() => {
    if (!open) return;
    let mounted = true;

    buildQrSvgDataUrl(buildCompanyVcfText(company), 180)
      .then((svgDataUrl) => {
        if (mounted) setQrSrc(svgDataUrl);
      })
      .catch(() => {
        if (mounted) setQrSrc("");
      });

    return () => {
      mounted = false;
    };
  }, [open, company]);

  const handleQrDownload = async () => {
    setQrDownloading(true);
    try {
      const blob = await buildQrBlob(buildCompanyVcfText(company), format);
      triggerBlobDownload(
        blob,
        `${company.name.replace(/\s+/g, "_")}-qr.${format}`,
      );
    } catch {
      message.error("QR kod yüklənmədi");
    } finally {
      setQrDownloading(false);
    }
  };

  const infoItems = [
    company.address
      ? { label: "Ünvan", value: company.address, icon: <EnvironmentOutlined /> }
      : null,
    company.email
      ? { label: "Email", value: company.email, icon: <MailOutlined /> }
      : null,
    company.phone
      ? { label: "Nömrə", value: company.phone, icon: <PhoneOutlined /> }
      : null,
  ].filter((item): item is NonNullable<typeof item> => item !== null);

  return (
    <MobileBottomSheet open={open} onClose={onClose} title="Şirkəti paylaş">
      <div style={styles.header}>
        <div style={styles.headerLogo}>
          {logoSrc ? (
            <img src={logoSrc} alt={company.name} style={styles.headerLogoImage} />
          ) : (
            <BankOutlined style={styles.headerLogoFallback} />
          )}
        </div>
        <div style={styles.headerText}>
          <span style={styles.headerName}>{company.name}</span>
          {company.voen && (
            <span style={styles.headerVoen}>VÖEN: {company.voen}</span>
          )}
        </div>
      </div>

      <div style={styles.qrSection}>
        {qrSrc ? (
          <img src={qrSrc} alt="Şirkət QR kodu" style={styles.qrImage} />
        ) : (
          <div style={styles.qrFallback}>QR</div>
        )}
        <span style={styles.qrHint}>Skan edib kontakt kimi saxlaya bilərsiniz</span>
        <div role="group" aria-label="QR formatı" style={styles.formatSelector}>
          {(["png", "svg"] as const).map((option) => {
            const selected = format === option;
            return (
              <button
                key={option}
                type="button"
                aria-pressed={selected}
                disabled={qrDownloading}
                onClick={() => setFormat(option)}
                style={{
                  ...styles.formatButton,
                  ...(selected ? styles.formatButtonSelected : {}),
                }}
              >
                {option.toUpperCase()}
              </button>
            );
          })}
        </div>
        <Button
          icon={<DownloadOutlined />}
          loading={qrDownloading}
          onClick={() => void handleQrDownload()}
          size="small"
        >
          QR kodu yüklə
        </Button>
      </div>

      <div style={styles.infoList}>
        {infoItems.map((item) => (
          <div key={item.label} style={styles.infoRow}>
            <span style={styles.infoIcon}>{item.icon}</span>
            <span style={styles.infoBody}>
              <span style={styles.infoLabel}>{item.label}</span>
              <span style={styles.infoValue}>{item.value}</span>
            </span>
          </div>
        ))}
      </div>

      <div style={styles.actions}>
        <Button
          block
          size="large"
          icon={<CopyOutlined />}
          onClick={() => copyToClipboard(shareText)}
        >
          Kopyala
        </Button>
        <div className="share-sheet-actions" style={styles.shareRow}>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
            target="_blank"
            rel="noreferrer"
            className="share-sheet-target"
            style={styles.shareIcon}
          >
            <span style={styles.shareIconCircle}>
              <WhatsAppOutlined style={styles.shareIconGlyph} />
            </span>
            WhatsApp
          </a>
          <a
            href={`mailto:?subject=${encodeURIComponent(company.name)}&body=${encodeURIComponent(shareText)}`}
            className="share-sheet-target"
            style={styles.shareIcon}
          >
            <span style={styles.shareIconCircle}>
              <MailOutlined style={styles.shareIconGlyph} />
            </span>
            Email
          </a>
          {canNativeShare && (
            <button
              type="button"
              className="share-sheet-target"
              style={styles.shareIcon}
              onClick={() =>
                navigator
                  .share({ title: company.name, text: shareText })
                  .catch(() => {})
              }
            >
              <span style={styles.shareIconCircle}>
                <ShareAltOutlined style={styles.shareIconGlyph} />
              </span>
              Paylaş
            </button>
          )}
        </div>
      </div>
    </MobileBottomSheet>
  );
}
