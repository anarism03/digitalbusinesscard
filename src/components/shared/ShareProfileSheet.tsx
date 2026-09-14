import { useState } from "react";
import { Button, Input, message } from "antd";
import {
  DownloadOutlined,
  ScanOutlined,
  WhatsAppOutlined,
  CopyOutlined,
  ShareAltOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import MobileBottomSheet from "../company-admin/mobile/MobileBottomSheet";
import QRPreview from "../../pages/company-admin/shared/QRPreview";
import { copyToClipboard } from "../../utils/feedback";
import {
  getContactCardFields,
  isContactCardEnabled,
} from "../../utils/cardLinkRows";
import { triggerBlobDownload } from "../../utils/download";
import { buildQrBlob } from "../../utils/qr";
import { buildVcfText, overridesFromContactCard } from "../../utils/vcard";
import { styles } from "../../styles/shared/ShareProfileSheet.styles";
import type { Employee } from "../../types";

type QrFormat = "png" | "svg";

interface Props {
  open: boolean;
  onClose: () => void;
 
  employee: Employee;
  employeeName?: string;
  rootClassName?: string;
}

export default function ShareProfileSheet({
  open,
  onClose,
  employee,
  employeeName,
  rootClassName,
}: Props) {
  const [view, setView] = useState<"qr" | "share">("qr");
  const [format, setFormat] = useState<QrFormat>("png");
  const [isDownloading, setIsDownloading] = useState(false);
  const displayName = employeeName || employee.fullName;
  const link = `${window.location.origin}/v/${employee.id}`;
  const shareText = `${displayName}\n${link}`;
  const canNativeShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  const handleClose = () => {
    onClose();
    setFormat("png");
    setIsDownloading(false);
    setTimeout(() => setView("qr"), 300);
  };

  const handleDownload = async () => {
    if (isDownloading) return;

    setIsDownloading(true);
    try {
      const overrides = overridesFromContactCard(
        getContactCardFields(employee.contactInfos),
        isContactCardEnabled(employee.contactInfos),
      );
      const blob = await buildQrBlob(buildVcfText(employee, overrides), format);
      triggerBlobDownload(blob, `qr-${employee.id}.${format}`);
    } catch {
      message.error("QR kod yüklənmədi");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <MobileBottomSheet
      open={open}
      onClose={handleClose}
      rootClassName={
        ["share-profile-sheet", rootClassName].filter(Boolean).join(" ")
      }
    >
      {view === "qr" ? (
        <div className="share-sheet-panel" style={styles.qrView}>
          <ScanOutlined style={styles.headerIcon} />
          <div style={styles.title}>QR kodum</div>
          <div style={styles.subtitle}>
            Digərləri profilinizi görmək üçün QR kodu skan edə bilər
          </div>
          <div style={styles.qrFrame}>
            <QRPreview employee={employee} size={164} />
          </div>
          <div className="share-sheet-actions" style={styles.actions}>
            <div
              role="group"
              aria-label="QR formatı"
              style={styles.formatSelector}
            >
              {(["png", "svg"] as const).map((option) => {
                const selected = format === option;
                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={selected}
                    disabled={isDownloading}
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
              block
              size="large"
              icon={<DownloadOutlined />}
              loading={isDownloading}
              disabled={isDownloading}
              aria-label="QR kodu yüklə"
              onClick={() => void handleDownload()}
              style={styles.downloadButton}
            >
              Yüklə
            </Button>
            <Button
              type="primary"
              block
              size="large"
              onClick={() => setView("share")}
              style={styles.primaryButton}
            >
              Profili paylaşmaq
            </Button>
          </div>
        </div>
      ) : (
        <div className="share-sheet-panel" style={styles.shareView}>
          <button
            type="button"
            style={styles.backButton}
            onClick={() => setView("qr")}
          >
            <LeftOutlined /> Geri
          </button>
          <div style={styles.employeeName}>{displayName}</div>
          <div style={styles.linkRow}>
            <Input readOnly value={link} style={styles.linkInput} />
            <Button
              icon={<CopyOutlined />}
              onClick={() => copyToClipboard(link)}
              aria-label="Linki kopyala"
            />
          </div>
          <div style={styles.shareRow}>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noreferrer"
              style={styles.shareIcon}
              className="share-sheet-target"
            >
              <span style={styles.shareIconCircle}>
                <WhatsAppOutlined style={styles.shareIconGlyph} />
              </span>
              WhatsApp
            </a>
            {canNativeShare && (
              <button
                type="button"
                style={styles.shareIcon}
                className="share-sheet-target"
                onClick={() =>
                  navigator
                    .share({ title: displayName, url: link, text: shareText })
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
      )}
    </MobileBottomSheet>
  );
}
