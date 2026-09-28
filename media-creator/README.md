# media-creator（帧记影像）

面向视频创作者的深色影院感 novablog 内容主页。深蓝黑放映室氛围 + 长春花蓝主色 + 手写体涂鸦点缀，参考「FrameWithMe」影像创作者主页风格。

## 页面结构

| 路由 | 说明 | 模块开关 |
|------|------|------|
| `/` | 首页：手写标题 Hero（博主大图）+ 精选作品 + 关于我 / 最新动态 / 我的装备三栏 | — |
| `/videos` | 作品：视频卡片网格，支持关键词搜索 | `video_enabled` |
| `/articles`、`/articles/[slug]` | 博客：分类筛选列表与详情，未预渲染的详情由 `public/article.html` 深色壳页面兜底 | `article_enabled` |
| `/about` | 关于我：头像、简介、创作方向与社交平台 | — |
| `/gear` | 设备：器材卡片网格 | `equipment_enabled` |
| `/contact` | 联系：邮箱、坐标与社交平台 | — |
| `/open-source`、`/open-source/[id]` | 开源作品列表与详情（语言/话题标签/Star 数 + README 渲染 + 仓库/主页外链） | `open_source_enabled` |
| `/recipes`、`/recipes/[id]` | 美食菜谱列表与详情（难度/耗时/份量 + 食材清单 + 编号步骤配图） | `recipe_enabled` |
| `/books`、`/books/[id]` | 读书书架列表与详情（星级/阅读状态徽标 + 书评渲染 + 起止阅读时间） | `book_enabled` |
| `/games`、`/games/[id]` | 游戏库列表与详情（平台/类型/游玩状态/评分(x/10)/时长 + 简评渲染） | `game_enabled` |
| `/fitness` | 健身训练记录列表（日期/类型徽标/时长/千卡） | `fitness_enabled` |
| `/tech-stack` | 技术栈展示（图标/分类/四档熟练度分段条） | `tech_stack_enabled` |

导航与页面展示由后端「模块开关配置」（`/public/module-config`）驱动：视频 / 博客 / 设备模块关闭时自动隐藏入口并显示占位页。六个新内容模块（开源作品/美食菜谱/读书书架/游戏库/健身训练/技术栈）收纳在导航「更多」下拉组（移动端为「更多功能」小节）中，随各自模块开关过滤，六个全关时整个下拉不渲染。页脚含主题来源链接（`theme.json` homepage）。

## 对接的后端模块

- 博主信息（头像、简介、城市、标签、社交链接、页面背景图）
- 视频作品（封面、平台链接）
- 文章（列表、分类、标签、详情、浏览量上报、评论）
- 摄影器材（图片、品牌、介绍）
- 模块开关配置

## 本地开发

```bash
pnpm install
cp .env.example .env.local
# 编辑 .env.local，设置 NEXT_PUBLIC_API_BASE_URL 为 novablog API 地址
pnpm dev
```

## 生产构建

```bash
# 与 CI 一致的离线自检：清空 API 地址，取数失败自动回退
NEXT_PUBLIC_API_BASE_URL= pnpm build
```

构建产物输出到 `dist/` 目录。

### 静态导出与动态路由

本项目使用 `output: "export"` 进行静态导出。文章详情页 `/articles/[slug]` 依赖 `generateStaticParams` 在构建时从 API 获取所有已发布文章的 slug 列表；后端不可达时生成占位页，真实详情由 `public/article.html` 壳页面客户端取数兜底。

## 技术栈

- Next.js 15 + App Router（静态导出）
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- lucide-react
- Ma Shan Zheng（手写字体，next/font 自托管）
