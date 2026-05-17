export const IMAGE_UPLOAD_LIMITS = {
  maxOriginalBytes: 12 * 1024 * 1024,
  maxUploadBytes: 4 * 1024 * 1024,
  targetBytes: 2 * 1024 * 1024,
  maxEdge: 1600,
  minQuality: 0.55 as number,
  maxQuality: 0.86 as number,
  outputType: "image/jpeg",
} as const;

export function formatImageSize(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}

function isRasterPhoto(file: File) {
  return ["image/jpeg", "image/png", "image/webp"].includes(file.type);
}

function toJpegName(name: string) {
  const base = name.replace(/\.[^.]+$/, "");
  return `${base || "meal-photo"}.jpg`;
}

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("图片读取失败，请换一张照片"));
    };
    img.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("图片压缩失败，请换一张照片"));
      },
      IMAGE_UPLOAD_LIMITS.outputType,
      quality,
    );
  });
}

async function compressRasterPhoto(file: File) {
  const img = await loadImage(file);
  const scale = Math.min(
    1,
    IMAGE_UPLOAD_LIMITS.maxEdge / Math.max(img.naturalWidth, img.naturalHeight),
  );
  const width = Math.max(1, Math.round(img.naturalWidth * scale));
  const height = Math.max(1, Math.round(img.naturalHeight * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("图片压缩失败，请换一张照片");
  ctx.drawImage(img, 0, 0, width, height);

  let low = IMAGE_UPLOAD_LIMITS.minQuality;
  let high = IMAGE_UPLOAD_LIMITS.maxQuality;
  let bestUnderTarget: Blob | null = null;
  let smallest = await canvasToBlob(canvas, low);

  for (let i = 0; i < 6; i += 1) {
    const quality = (low + high) / 2;
    const blob = await canvasToBlob(canvas, quality);
    if (blob.size <= IMAGE_UPLOAD_LIMITS.targetBytes) {
      bestUnderTarget = blob;
      low = quality;
    } else {
      high = quality;
      if (blob.size < smallest.size) smallest = blob;
    }
  }

  return bestUnderTarget ?? smallest;
}

export async function prepareMealPhotoForUpload(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) {
    throw new Error("只能上传图片");
  }

  if (file.size > IMAGE_UPLOAD_LIMITS.maxOriginalBytes) {
    throw new Error(
      `图片超过 ${formatImageSize(
        IMAGE_UPLOAD_LIMITS.maxOriginalBytes,
      )}，请换一张更小的照片`,
    );
  }

  if (!isRasterPhoto(file)) {
    if (file.size <= IMAGE_UPLOAD_LIMITS.maxUploadBytes) return file;
    throw new Error("这张图片太大，当前格式无法自动压缩，请换一张照片");
  }

  let compressed: Blob;
  try {
    compressed = await compressRasterPhoto(file);
  } catch (error) {
    if (file.size <= IMAGE_UPLOAD_LIMITS.maxUploadBytes) return file;
    throw error;
  }

  const uploadBlob =
    file.size <= IMAGE_UPLOAD_LIMITS.maxUploadBytes && file.size < compressed.size
      ? file
      : compressed;

  if (uploadBlob.size > IMAGE_UPLOAD_LIMITS.maxUploadBytes) {
    throw new Error(
      `图片压缩后仍超过 ${formatImageSize(
        IMAGE_UPLOAD_LIMITS.maxUploadBytes,
      )}，请换一张更小的照片`,
    );
  }

  if (uploadBlob instanceof File) return uploadBlob;
  return new File([uploadBlob], toJpegName(file.name), {
    type: IMAGE_UPLOAD_LIMITS.outputType,
    lastModified: Date.now(),
  });
}
