import { message } from "./feedback";

const IMAGE_MAX_INPUT_SIZE_BYTES = 8 * 1024 * 1024;

const IMAGE_TARGET_SIZE_BYTES = 450 * 1024;

const TRANSPARENT_TYPES = [
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/gif",
];

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
}
async function loadImageSource(
  file: File,
): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch {
    }
  }

  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Şəkil oxunmadı"));
    };

    image.src = objectUrl;
  });
}

export async function compressImageToDataUrl(
  file: File,
  maxSizePx = 1200,
  quality = 0.85,
): Promise<string> {
  if (file.type === "image/svg+xml") {
    return readFileAsDataUrl(file);
  }

  const source = await loadImageSource(file);
  const sourceWidth = source.width;
  const sourceHeight = source.height;

  if (
    file.size <= IMAGE_TARGET_SIZE_BYTES &&
    Math.max(sourceWidth, sourceHeight) <= maxSizePx &&
    (file.type === "image/jpeg" || file.type === "image/png")
  ) {
    return readFileAsDataUrl(file);
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
  maxSizePx = 600,
  quality = 0.85,
): Promise<string | undefined> {
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Şəkil oxunmadı"));
      el.src = dataUrl;
    });

    const width = image.naturalWidth || maxSizePx;
    const height = image.naturalHeight || maxSizePx;
    const scale = Math.min(1, maxSizePx / Math.max(width, height));

    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));
    const context = canvas.getContext("2d");
    if (!context) return undefined;

    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", quality);
  } catch {
    return undefined;
  }
}

export function validateImageFile(
  file: File,
  maxSize = IMAGE_MAX_INPUT_SIZE_BYTES,
): boolean {
  if (!file.type.startsWith("image/")) {
    message.error("Yalnız şəkil faylı seçin");
    return false;
  }

  if (file.size > maxSize) {
    message.error("Şəkil maksimum 8MB olmalıdır");
    return false;
  }

  return true;
}

function dataUrlSize(dataUrl: string): number {
  const payload = dataUrl.split(",")[1] ?? "";
  return Math.ceil((payload.length * 3) / 4);
}

const MIME_EXTENSIONS: Record<string, string> = {
  "image/png": "png",
  "image/svg+xml": "svg",
  "image/webp": "webp",
  "image/gif": "gif",
};

export function dataUrlToFile(dataUrl: string, baseName = "photo"): File {
  const [header, payload = ""] = dataUrl.split(",");
  const mime = header.match(/^data:(.*?);/)?.[1] ?? "image/jpeg";
  const extension = MIME_EXTENSIONS[mime] ?? "jpg";
  const binary = atob(payload);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new File([bytes], `${baseName}.${extension}`, { type: mime });
}
