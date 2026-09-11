# tech-geek

面向开发者、开源爱好者与硬核技术读者的深色极客风格 novablog 前端。

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

构建产物输出到 `dist/` 目录。
