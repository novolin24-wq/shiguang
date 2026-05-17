import type { NextConfig } from "next";

function normalizeDevOrigin(origin: string) {
  const trimmed = origin.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("*.")) return trimmed.toLowerCase();

  try {
    const url = new URL(
      trimmed.includes("://") ? trimmed : `http://${trimmed}`,
    );
    return url.hostname.toLowerCase();
  } catch {
    return trimmed.toLowerCase();
  }
}

const allowedDevOrigins = process.env.NEXT_ALLOWED_DEV_ORIGINS?.split(",")
  .map(normalizeDevOrigin)
  .filter((origin): origin is string => Boolean(origin));

const nextConfig: NextConfig = {
  // 允许本地按需配置手机/局域网验收来源；仓库不写死个人 IP。
  // 示例：NEXT_ALLOWED_DEV_ORIGINS=192.168.1.23:3000,*.local
  allowedDevOrigins,

  // CloudBase JS SDK 内部包含 Node.js adapter（引用 jsonwebtoken 等），
  // 在 SSR 时会报 module not found。标记为 external 让服务端跳过打包。
  serverExternalPackages: [
    "@cloudbase/js-sdk",
    "@cloudbase/app",
    "@cloudbase/auth",
    "@cloudbase/storage",
    "@cloudbase/database",
    "@cloudbase/realtime",
    "@cloudbase/analytics",
    "@cloudbase/model",
    "@cloudbase/ai",
    "@cloudbase/cloudrun",
    "@cloudbase/mysql",
    "@cloudbase/apis",
    "@cloudbase/functions",
  ],
};

export default nextConfig;
