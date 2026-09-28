import { message } from "./feedback";

const IMAGE_MAX_INPUT_SIZE_BYTES = 8 * 1024 * 1024;
const IMAGE_TARGET_SIZE_BYTES = 450 * 1024;

const TRANSPARENT_TYPES = [
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/gif",
];

export function readAsDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Şəkil oxunmadı"));
    reader.readAsDataURL(blob);
  });
}

async function loadImage(source: Blob | string): Promise<HTMLImageElement> {
  const url = typeof source === "string" ? source : URL.createObjectURL(source);
  try {
    return await new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error("Şəkil oxunmadı"));
      image.src = url;
    });
  } finally {
    if (typeof source !== "string") URL.revokeObjectURL(url);
  }
}

export async function compressImageToDataUrl(
  file: File,
  maxSizePx = 1200,
  quality = 0.85,
): Promise<string> {
  if (file.type === "image/svg+xml") {
    return readAsDataUrl(file);
  }

  const source = await loadImage(file);
  const sourceWidth = source.width;
  const sourceHeight = source.height;

  if (
    file.size <= IMAGE_TARGET_SIZE_BYTES &&
    Math.max(sourceWidth, sourceHeight) <= maxSizePx &&
    (file.type === "image/jpeg" || file.type === "image/png")
  ) {
    return readAsDataUrl(file);
  }

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas dəstəklənmir");

  const keepAlpha = TRANSPARENT_TYPES.includes(file.type);
  let scale = Math.min(1, maxSizePx / Math.max(sourceWidth, sourceHeight));
  let result = "";

  for (let attempt = 0; attempt < 4; attempt += 1) {
    const width = Math.max(1, Math.round(sourceWidth * scale));
    const height = Math.max(1, Math.round(sourceHeight * scale));

    canvas.width = width;
    canvas.height = height;
    context.clearRect(0, 0, width, height);
    context.drawImage(source, 0, 0, width, height);

    if (keepAlpha) {
      result = canvas.toDataURL("image/png");
      if (dataUrlSize(result) <= IMAGE_TARGET_SIZE_BYTES) return result;
    }

    context.fillStyle = "#fff";
    context.fillRect(0, 0, width, height);
    context.drawImage(source, 0, 0, width, height);

    for (const nextQuality of [quality, 0.8, 0.7, 0.58]) {
      result = canvas.toDataURL("image/jpeg", nextQuality);
      if (dataUrlSize(result) <= IMAGE_TARGET_SIZE_BYTES) return result;
    }

    scale *= 0.8;
  }

  return result || canvas.toDataURL("image/jpeg", 0.48);
}

export async function rasterizeDataUrlToJpeg(
  dataUrl: string,
): Promise<string | undefined> {
  try {
    const image = await loadImage(dataUrl);

    const width = image.naturalWidth || 600;
    const height = image.naturalHeight || 600;
    const scale = Math.min(1, 600 / Math.max(width, height));

    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));
    const context = canvas.getContext("2d");
    if (!context) return undefined;

    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.85);
  } catch {
    return undefined;
  }
}

export function validateImageFile(file: File): boolean {
  if (!file.type.startsWith("image/")) {
    message.error("Yalnız şəkil faylı seçin");
    return false;
  }

  if (file.size > IMAGE_MAX_INPUT_SIZE_BYTES) {
    message.error("Şəkil maksimum 8MB olmalıdır");
    return false;
  }

  return true;
}

function dataUrlSize(dataUrl: string): number {
  const payload = dataUrl.split(",")[1] ?? "";
  return Math.ceil((payload.length * 3) / 4);
}

export async function isZipBlob(blob: Blob): Promise<boolean> {
  if (blob.type.includes("zip")) return true;
  const head = new Uint8Array(await blob.slice(0, 2).arrayBuffer());
  return head[0] === 0x50 && head[1] === 0x4b;
}

export function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
