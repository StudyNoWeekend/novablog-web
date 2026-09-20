# lens-life-template（镜头生活）

暗色优雅风格的 novablog 前端主题模板。

当前版本 **v1.0.2**，发布 tag 为 `lens-life-template-v1.0.2`。

## 功能模块

| 路由 | 说明 | 模块开关 |
|---|---|---|
| `/` | 首页：主视觉、精选文章与最新旅拍 | — |
| `/articles`、`/articles/[slug]` | 文章列表与详情，含评论与浏览量统计 | `article_enabled` |
| `/travels`、`/travels/[id]` | 旅拍攻略列表与详情，含点赞、评论 | `travel_enabled` |
| `/portfolio` | 作品集画廊，支持大图浏览 | `portfolio_enabled` |
| `/videos` | 视频列表 | `video_enabled` |
| `/music` | 音乐分享，含歌单与全局迷你播放器 | `music_enabled` |
| `/gear` | 器材清单 | `equipment_enabled` |
| `/about`、`/contact` | 关于与联系页 | — |

模块开关由 CMS 的 `/public/module-config` 下发：构建时读取一次作为兜底，浏览器端运行时再次获取，隐藏被关闭的导航项并让对应页面显示禁用提示。页脚展示主题版本号与 `theme.json` 中的源码仓库链接。

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

后端不可达时构建依然可通过：文章与旅拍详情页在构建期拉取 slug/id 列表，拉取失败或为空时生成 `__fallback__` 占位页；未被预渲染的动态路径由 `theme.json` 的 `routes.fallback` 兜底到 `dist/article.html`、`dist/travel.html` 壳页面，由 CMS 托管层在运行时返回。

## 技术栈

- Next.js 15 + App Router
- TypeScript
- Tailwind CSS
- lucide-react
