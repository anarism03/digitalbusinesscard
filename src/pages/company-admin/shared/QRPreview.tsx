import { useEffect, useState } from "react";
import {
  getContactCardFields,
  isContactCardEnabled,
} from "../../../utils/cardLinkRows";
import { buildQrSvgDataUrl } from "../../../utils/qr";
import { buildVcfText, overridesFromContactCard } from "../../../utils/vcard";
import {
  getQrFallbackStyle,
  getQrImageStyle,
} from "../../../styles/company-admin/QrParts.styles";
import type { Employee } from "../../../types";

interface Props {
  employee: Employee;
  size?: number;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export default function QRPreview({ employee, size = 220, onClick, style }: Props) {
  const [src, setSrc] = useState("");

  useEffect(() => {
    if (!employee) return;
    let mounted = true;

    const overrides = overridesFromContactCard(
      getContactCardFields(employee.contactInfos),
      isContactCardEnabled(employee.contactInfos),
    );

    buildQrSvgDataUrl(buildVcfText(employee, overrides), size)
      .then((svgDataUrl) => {
        if (mounted) setSrc(svgDataUrl);
      })
      .catch(() => {
        if (mounted) setSrc("");
      });

    return () => {
      mounted = false;
    };
  }, [employee, size]);

  if (!src) {
    return (
      <div onClick={onClick} style={getQrFallbackStyle(size, Boolean(onClick), style)}>
        QR
      </div>
    );
  }

  return (
    <img
      src={src}
      alt="QR kod"
      onClick={onClick}
      style={getQrImageStyle(size, Boolean(onClick), style)}
    />
  );
}
