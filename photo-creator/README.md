# photo-creator

面向摄影爱好者与视觉内容消费者的高留白、图片优先风格 novablog 作品集博客。

## 页面结构

| 路由 | 说明 | 模块开关 |
|------|------|------|
| `/` | 首页：精选作品展示 + 最新文章 | — |
| `/articles`、`/articles/[slug]` | 文章列表与详情，详情页未预渲染的由 `public/article.html` 壳页面兜底 | `article_enabled` |
| `/portfolios`、`/portfolios/[id]` | 作品集列表与详情大图浏览，未预渲染的由 `public/portfolio.html` 壳页面兜底 | `portfolio_enabled` |
| `/music` | 音乐播放器 | `music_enabled` |
| `/open-source`、`/open-source/[id]` | 开源作品列表与详情（语言/话题标签/Star 数 + README 渲染 + 仓库/主页外链），详情由 `public/open-source.html` 壳页面兜底 | `open_source_enabled` |
| `/recipes`、`/recipes/[id]` | 美食菜谱列表与详情（难度/耗时/份量 + 食材清单 + 编号步骤配图），详情由 `public/recipe.html` 壳页面兜底 | `recipe_enabled` |
| `/books`、`/books/[id]` | 读书书架列表与详情（星级/阅读状态徽标 + 书评渲染 + 起止阅读时间），详情由 `public/book.html` 壳页面兜底 | `book_enabled` |
| `/games`、`/games/[id]` | 游戏库列表与详情（平台/类型/游玩状态/评分(x/10)/时长 + 简评渲染），详情由 `public/game.html` 壳页面兜底 | `game_enabled` |
| `/fitness` | 健身训练记录列表（日期/类型徽标/时长/千卡） | `fitness_enabled` |
| `/tech-stack` | 技术栈展示（图标/分类/四档熟练度分段条） | `tech_stack_enabled` |

导航与页面展示由后端「模块开关配置」（`/api/v1/public/module-config`）驱动：关闭文章/作品集/音乐模块会隐藏对应导航项并在页面渲染「模块未开启」提示。六个内容模块（开源作品/美食菜谱/读书书架/游戏库/健身训练/技术栈）收纳在导航「更多」下拉组（移动端为「更多功能」小节）中，随各自模块开关过滤，六个全关时整个下拉不渲染；页脚同步展示这六个链接并随开关过滤。

已接入博主星座/性格展示（数据来自 `/api/v1/public/blogger` 的 `zodiac`/`personality`，本地 logo，关于我页卡片 + 首页 Hero 徽章，未设置或博主关闭展示时不渲染）。

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
