import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
