# lens-life-template（镜头生活）

用镜头收藏世界的边角与光芒：风光、城市、人文与航拍作品，以及摄影教程与器材分享的暗色优雅风格 novablog 前端。

## 本地开发

```bash
pnpm install
cp .env.example .env.local
# 编辑 .env.local，设置 NEXT_PUBLIC_API_BASE_URL 为 novablog API 地址
pnpm dev
```

## 生产构建

```bash
pnpm build
```

纯静态导出（`output: "export"`），产物输出到 `dist/` 目录，按 NovaBlog 主题包规范打包后可被 CMS 安装托管（见仓库根 `docs/theme-spec.md`）。
