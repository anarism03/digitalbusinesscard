const SVG_DATA_URL_PREFIX = "data:image/svg+xml;charset=utf-8,";

export async function buildQrSvgDataUrl(
  value: string,
  width: number,
): Promise<string> {
  const { default: QRCode } = await import("qrcode");
  const svg = await QRCode.toString(value, {
    type: "svg",
    width,
    margin: 1,
  });

  return `${SVG_DATA_URL_PREFIX}${encodeURIComponent(svg)}`;
}

export async function buildQrBlob(
  value: string,
  format: "png" | "svg",
  width = 512,
): Promise<Blob> {
  const { default: QRCode } = await import("qrcode");
  if (format === "svg") {
    const svg = await QRCode.toString(value, { type: "svg", width, margin: 1 });
    return new Blob([svg], { type: "image/svg+xml" });
  }
  const dataUrl = await QRCode.toDataURL(value, { width, margin: 1 });
  const response = await fetch(dataUrl);
  return response.blob();
}
