# media-creator

面向视频观众与社交媒体追随者的明亮活泼风格 novablog 内容主页。

## 本地开发

```bash
pnpm install
cp .env.example .env.local
# 编辑 .env.local，设置 NEXT_PUBLIC_API_BASE_URL 为 novablog API 地址
pnpm dev
```

## 生产构建

```bash
# 确保 NEXT_PUBLIC_API_BASE_URL 已设置，以便构建时能从 API 拉取文章 slug 列表
pnpm build
```

构建产物输出到 `dist/` 目录。

### 静态导出与动态路由

本项目使用 `output: "export"` 进行静态导出。文章详情页 `/articles/[slug]` 依赖 `generateStaticParams` 在构建时从 API 获取所有已发布文章的 slug 列表。因此，**生产构建前请确保 API 服务可访问**；否则只会生成占位页面 `/articles/placeholder.html`，真实文章详情页将无法访问。

## 技术栈

- Next.js 15 + App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- lucide-react
