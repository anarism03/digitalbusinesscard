import { useEffect, useState } from "react";
import {
  getContactCardFields,
  isContactCardEnabled,
} from "../../../utils/contactCardFields";
import { buildQrSvgDataUrl } from "../../../utils/qr";
import { buildVcfText, overridesFromContactCard } from "../../../utils/vcard";
import {
  getQrFallbackStyle,
  getQrImageStyle,
} from "../../../styles/company-admin/QRPreview.styles";
import type { Employee } from "../../../types";

interface Props {
  employee: Employee;
  size: number;
}

export default function QRPreview({ employee, size }: Props) {
  const [src, setSrc] = useState("");

  useEffect(() => {
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
    return <div style={getQrFallbackStyle(size)}>QR</div>;
  }

  return <img src={src} alt="QR kod" style={getQrImageStyle(size)} />;
}
