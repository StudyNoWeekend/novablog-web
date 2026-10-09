# lens-life-template（镜头生活）

暗色优雅风格的 novablog 前端主题模板。

当前版本 **v1.4.0**，发布 tag 为 `lens-life-template-v1.4.0`。

## 功能模块

| 路由 | 说明 | 模块开关 |
|---|---|---|
| `/` | 首页：主视觉、精选文章与最新旅拍 | — |
| `/articles`、`/articles/[slug]` | 文章列表与详情，含评论与浏览量统计 | `article_enabled` |
| `/travels`、`/travels/[id]` | 旅拍攻略列表与详情，含点赞、评论 | `travel_enabled` |
| `/portfolio` | 作品集画廊，支持大图浏览 | `portfolio_enabled` |
| `/videos` | 视频列表 | `video_enabled` |
| `/music` | 音乐分享，含歌单与全局悬浮播放器（B 站外链 iframe） | `music_enabled` |
| `/gear`、`/gear/[id]` | 设备清单与详情页 | `equipment_enabled` |
| `/open-source`、`/open-source/[id]` | 开源作品列表与详情，渲染 Markdown README、仓库与主页外链 | `open_source_enabled` |
| `/recipes`、`/recipes/[id]` | 美食菜谱列表与详情，含难度筛选、食材清单与编号步骤图 | `recipe_enabled` |
| `/books`、`/books/[id]` | 读书书架列表与详情，含阅读状态筛选、星级与 Markdown 书评 | `book_enabled` |
| `/games`、`/games/[id]` | 游戏库列表与详情，含游玩状态筛选、评分（x/10）与短评 | `game_enabled` |
| `/fitness` | 健身训练记录列表，含训练类型筛选（仅列表页） | `fitness_enabled` |
| `/tech-stack` | 技术栈列表，含熟练度筛选与 4 档进度展示（仅列表页） | `tech_stack_enabled` |
| `/about`、`/contact` | 关于与联系页 | — |

模块开关由 CMS 的 `/public/module-config` 下发：构建时读取一次作为兜底，浏览器端运行时再次获取，隐藏被关闭的导航项并让对应页面显示禁用提示。六个新模块入口统一收纳在导航「更多」下拉与移动端「更多功能」小节中，随开关过滤；页脚同步展示对应链接。页脚展示主题版本号与 `theme.json` 中的源码仓库链接。

已接入博主星座/性格展示（本地 logo，关于我页卡片 + 首页 Hero 徽章）。

已接入旅行攻略地图嵌入：攻略详情页在景点含坐标时嵌入 CMS 地图（`/map-embed/travel/:id`，iframe + postMessage 自适应高度）；景点卡片按坐标系显示对应地图平台跳转 chip（gcj02 → 高德、wgs84/未知 → Google，携带原始坐标新窗口打开，无坐标不显示）。

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

后端不可达时构建依然可通过：各动态详情页在构建期拉取 slug/id 列表，拉取失败或为空时生成 `__fallback__` 占位页；未被预渲染的动态路径由 `theme.json` 的 `routes.fallback` 兜底到 `dist/article.html`、`dist/travel.html`、`dist/open-source.html`、`dist/recipe.html`、`dist/book.html`、`dist/game.html` 壳页面，由 CMS 托管层在运行时返回。壳页面与预渲染详情页体验一致：`article.html` 遵循文章的 `is_comment` 开关，两者均内置评论区（评论列表、两级回复、发表表单）。

## 技术栈

- Next.js 15 + App Router
- TypeScript
- Tailwind CSS
- lucide-react
