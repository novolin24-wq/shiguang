import { NextResponse } from "next/server";
import { IMAGE_UPLOAD_LIMITS, formatImageSize } from "@/lib/image-upload";

export const runtime = "nodejs";

type CloudbaseApp = Awaited<ReturnType<typeof loadApp>>;

let appPromise: Promise<CloudbaseApp> | null = null;

async function loadApp() {
  const cloudbase = (await import("@cloudbase/js-sdk")).default;
  const envId = process.env.NEXT_PUBLIC_CB_ENV_ID;
  if (!envId) throw new Error("缺少环境变量 NEXT_PUBLIC_CB_ENV_ID");
  return cloudbase.init({ env: envId });
}

function getAppAsync() {
  if (!appPromise) appPromise = loadApp();
  return appPromise;
}

async function ensureAuth() {
  const app = await getAppAsync();
  const auth = app.auth({ persistence: "none" });
  try {
    await auth.signInAnonymously();
  } catch (error) {
    appPromise = null;
    throw error;
  }
}

function safeExt(name: string) {
  const ext = name.split(".").pop()?.toLowerCase();
  return ext && /^[a-z0-9]+$/.test(ext) ? ext : "jpg";
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "缺少图片文件" }, { status: 400 });
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "只能上传图片" }, { status: 400 });
    }
    if (file.size > IMAGE_UPLOAD_LIMITS.maxUploadBytes) {
      return NextResponse.json(
        {
          error: `图片超过 ${formatImageSize(
            IMAGE_UPLOAD_LIMITS.maxUploadBytes,
          )}，请先压缩后再上传`,
        },
        { status: 413 },
      );
    }

    await ensureAuth();
    const app = await getAppAsync();

    const ext = safeExt(file.name);
    const cloudPath = `meals/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}.${ext}`;
    const filePath = Buffer.from(await file.arrayBuffer());

    const upload = await app.uploadFile({
      cloudPath,
      filePath: filePath as unknown as string,
    });
    const urlResult = await app.getTempFileURL({ fileList: [upload.fileID] });
    const files = urlResult.fileList as {
      fileID: string;
      tempFileURL: string;
    }[];

    return NextResponse.json({
      fileID: upload.fileID,
      tempFileURL: files[0]?.tempFileURL ?? upload.fileID,
    });
  } catch (error) {
    console.error("Meal photo upload failed", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "图片上传失败" },
      { status: 500 },
    );
  }
}
