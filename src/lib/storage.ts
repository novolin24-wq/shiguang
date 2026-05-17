/**
 * 上传一张餐食照片到 CloudBase Storage
 * 返回 CloudBase 文件 ID 和可直接展示的临时 URL
 */
export interface MealPhotoUpload {
  fileID: string;
  tempFileURL: string;
}

export async function uploadMealPhoto(file: File): Promise<MealPhotoUpload> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/meal-photo", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(data?.error ?? "图片上传失败");
  }

  const data = (await res.json()) as {
    fileID: string;
    tempFileURL?: string;
  };
  return {
    fileID: data.fileID,
    tempFileURL: data.tempFileURL ?? data.fileID,
  };
}

/** 把 fileID 换成可直接用的临时 URL */
export async function getFileUrl(fileID: string): Promise<string> {
  return fileID;
}
