import { useEffect, useState } from "react";
import { buildQrSvgDataUrl } from "../../../utils/qr";
import {
  getQrFallbackStyle,
  getQrImageStyle,
} from "../../../styles/company-admin/QRPreview.styles";

interface Props {
  value: string;
  size: number;
}

export default function QRPreview({ value, size }: Props) {
  const [src, setSrc] = useState("");

  useEffect(() => {
    let mounted = true;

    buildQrSvgDataUrl(value, size)
      .then((svgDataUrl) => {
        if (mounted) setSrc(svgDataUrl);
      })
      .catch(() => {
        if (mounted) setSrc("");
      });

    return () => {
      mounted = false;
    };
  }, [value, size]);

  if (!src) {
    return <div style={getQrFallbackStyle(size)}>QR</div>;
  }

  return <img src={src} alt="QR kod" style={getQrImageStyle(size)} />;
}
