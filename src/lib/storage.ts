import { getAppAsync, ensureAuth } from "./cloudbase";

/**
 * 上传一张餐食照片到 CloudBase Storage
 * 返回 fileID
 */
export async function uploadMealPhoto(file: File): Promise<string> {
  await ensureAuth();
  const app = await getAppAsync();

  const ext = file.name.split(".").pop() || "jpg";
  const cloudPath = `meals/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const res = await app.uploadFile({
    cloudPath,
    filePath: file as unknown as string, // 浏览器端传 File 对象
  });

  return res.fileID;
}

/** 把 fileID 换成可直接用的临时 URL */
export async function getFileUrl(fileID: string): Promise<string> {
  await ensureAuth();
  const app = await getAppAsync();
  const res = await app.getTempFileURL({ fileList: [fileID] });
  const files = res.fileList as { fileID: string; tempFileURL: string }[];
  return files[0]?.tempFileURL ?? fileID;
}
