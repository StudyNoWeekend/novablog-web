# photo-creator

面向摄影爱好者与视觉内容消费者的高留白、图片优先风格 novablog 作品集博客。

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
