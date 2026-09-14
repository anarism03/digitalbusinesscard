import type { CSSProperties } from "react";
import { Button } from "antd";
import { useState } from "react";
import type { Employee } from "../../types";
import { triggerBlobDownload } from "../../utils/download";
import { message } from "../../utils/feedback";
import {
  buildVcfBlob,
  resolveVcfPhotoDataUrl,
  type ContactCardVcfOverrides,
} from "../../utils/vcard";
import { DEFAULT_CONTACT_CARD_BUTTON_LABEL } from "../../utils/contactCardFields";

interface VCardDownloadButtonProps {
  employee: Employee;
  block?: boolean;
  variant?: "primary" | "outline";
  label?: string;
  overrides?: ContactCardVcfOverrides;
  style?: CSSProperties;
}

export default function VCardDownloadButton({
  employee,
  block,
  variant = "primary",
  label = DEFAULT_CONTACT_CARD_BUTTON_LABEL,
  overrides,
  style,
}: VCardDownloadButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const photoDataUrl = await resolveVcfPhotoDataUrl(employee.photoUrl);
      const blob = buildVcfBlob(employee, photoDataUrl, overrides);
      triggerBlobDownload(
        blob,
        `${(overrides?.name || employee.fullName).replace(/\s+/g, "_")}.vcf`,
      );
    } catch {
      message.error("VCard yüklənmədi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      className={`vcard-download-btn vcard-download-btn--${variant}`}
      type={variant === "outline" ? "default" : "primary"}
      size="large"
      icon={
        <span className="vcard-download-btn__icon" aria-hidden="true">
          <img
            className="vcard-download-btn__icon-image"
            src="/imgs/icons/contacts.svg"
            alt=""
          />
        </span>
      }
      onClick={handleDownload}
      loading={loading}
      block={block}
      style={style}
    >
      {label}
    </Button>
  );
}
