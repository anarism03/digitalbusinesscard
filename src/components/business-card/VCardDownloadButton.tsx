import { useState } from "react";
import { Button } from "antd";
import { triggerBlobDownload } from "../../utils/file";
import { message } from "../../utils/feedback";
import { buildVcfText, resolveVcfPhotoDataUrl } from "../../utils/vcard";
import type { ContactCardVcfOverrides, Employee } from "../../types";

interface VCardDownloadButtonProps {
  employee: Employee;
  label: string;
  overrides?: ContactCardVcfOverrides;
}

export default function VCardDownloadButton({
  employee,
  label,
  overrides,
}: VCardDownloadButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const photoDataUrl = await resolveVcfPhotoDataUrl(employee.photoUrl);
      const blob = new Blob(
        [buildVcfText(employee, overrides, photoDataUrl ?? employee.photoUrl)],
        {
          type: "text/vcard;charset=utf-8",
        },
      );
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
      className="vcard-download-btn"
      type="primary"
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
      block
    >
      {label}
    </Button>
  );
}
