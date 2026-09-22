import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // NovaBlog 主题规范 3.1：纯静态导出，产物由 CMS 静态托管
  output: "export",
  distDir: "dist",
  images: {
    // 静态导出必须关闭图片优化（无 Node 常驻进程）；后端图片 CDN 域名不可控
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
};

export default nextConfig;
