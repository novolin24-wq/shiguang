/**
 * CloudBase 客户端 · 仅在浏览器端运行
 * SDK 包含 Node adapter（引用 jsonwebtoken 等），
 * 不能被 Next.js SSR 静态分析到，因此全部走动态 import。
 */

type CloudbaseApp = Awaited<ReturnType<typeof loadApp>>;

let appPromise: Promise<CloudbaseApp> | null = null;

async function loadApp() {
  const cloudbase = (await import("@cloudbase/js-sdk")).default;
  const envId = process.env.NEXT_PUBLIC_CB_ENV_ID;
  if (!envId) throw new Error("缺少环境变量 NEXT_PUBLIC_CB_ENV_ID");
  return cloudbase.init({ env: envId });
}

export function getAppAsync(): Promise<CloudbaseApp> {
  if (!appPromise) appPromise = loadApp();
  return appPromise;
}

let authReady: Promise<void> | null = null;

/** 确保匿名登录完成，整个应用只调一次 */
export function ensureAuth(): Promise<void> {
  if (authReady) return authReady;
  authReady = (async () => {
    const app = await getAppAsync();
    const auth = app.auth();
    const loginState = await auth.getLoginState();
    if (!loginState) {
      await auth.signInAnonymously();
    }
  })();
  return authReady;
}
