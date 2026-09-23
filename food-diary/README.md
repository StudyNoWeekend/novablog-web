# food-diary（美食日记）

温暖手账风格的 novablog 前端主题模板：奶油底色、蜜糖橙点缀、手写字体与拍立得相框，面向美食博主与生活记录者。

当前版本 **v0.1.0**，发布 tag 为 `food-diary-v0.1.0`。

## 功能模块

| 路由 | 说明 | 模块开关 |
|---|---|---|
| `/` | 首页：主视觉（拍立得照片堆）、热门分类磁贴、最新美食日记（含关于我侧栏卡片）、旅行横幅 | — |
| `/articles`、`/articles/[slug]` | 美食日记列表与详情：分类筛选、关键词搜索、人气榜、标签云、评论与浏览量统计 | `article_enabled` |
| `/recipes` | 菜谱分享：与文章模块同源数据，以大图菜谱卡片呈现，支持分页 | `article_enabled` |
| `/travels`、`/travels/[id]` | 旅行美食列表与详情：天数/排序筛选、觅食推荐（JSONB）、行程时间线、点赞、评论 | `travel_enabled` |
| `/about` | 关于我：拍立得头像、博主标签、社交链接 | — |

模块开关由 CMS 的 `/public/module-config` 下发：构建时读取一次作为兜底，浏览器端运行时再次获取，隐藏被关闭的导航项并让对应页面显示禁用提示。页脚展示主题版本号与 `theme.json` 中的源码仓库链接（主题来源链接）。

## 本地开发

```bash
pnpm install
cp .env.local.example .env.local
# 编辑 .env.local，设置 NEXT_PUBLIC_API_BASE_URL 为 novablog API 地址
pnpm dev
```

## 生产构建

```bash
pnpm build
```

纯静态导出（`output: "export"`），产物输出到 `dist/` 目录，按 NovaBlog 主题包规范打包后可被 CMS 安装托管（见仓库根 `docs/theme-spec.md`）。

后端不可达时构建依然可通过：文章与旅行详情页在构建期拉取 slug/id 列表，拉取失败或为空时生成 `__fallback__` 占位页；未被预渲染的动态路径由 `theme.json` 的 `routes.fallback` 兜底到 `dist/article.html`、`dist/travel.html` 壳页面，由 CMS 托管层在运行时返回。壳页面与预渲染详情页体验一致：`article.html` 遵循文章的 `is_comment` 开关，两者均内置评论区（评论列表、两级回复、发表表单）与浏览计数上报；`travel.html` 额外内置点赞按钮。

`article.html` 对正文做双模式渲染：内容为 HTML（富文本编辑器）时经白名单净化后渲染，为 Markdown 时先整体转义再解析，两种路径均防 XSS。

## 本地视觉验收工具（可选）

仓库内附两个仅开发调试用的脚本（不进入发布制品）：

```bash
# 1. mock API：覆盖主题消费的全部公开接口，默认端口 8222
node mock-server.mjs

# 2. 托管 dist/ 并模拟 CMS 解析顺序与壳页面兜底，默认端口 3311；/api 代理到 mock
NEXT_PUBLIC_API_BASE_URL= pnpm build
node serve-dist.mjs
```

## 技术栈

- Next.js 15 + App Router
- TypeScript
- Tailwind CSS
- lucide-react
