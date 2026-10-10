# tech-geek

面向开发者、开源爱好者与硬核技术读者的 novablog 前端主题。亮色为默认主题（蓝色主色），支持一键切换暗色终端风；布局参照「DevNotes」设计稿：暗色 Hero + 文章列表/侧边栏两栏结构。

## 页面结构

| 路由 | 说明 | 模块开关 |
|------|------|------|
| `/` | 首页：Hero（问候语 + 数据统计）+ 最新文章列表 + 侧边栏（博主卡片/热门标签/分类目录/写作激励卡） | — |
| `/articles` | 文章列表：搜索、分类筛选、标签筛选、分页 | `article_enabled` |
| `/articles/[slug]` | 文章详情（构建期 SSG 预渲染，未预渲染的由 `public/article.html` 壳页面兜底） | `article_enabled` |
| `/categories` | 分类目录 | `article_enabled` |
| `/tags` | 标签云 | `article_enabled` |
| `/travels`、`/travels/[id]` | 旅行攻略列表与详情 | `travel_enabled` |
| `/portfolio`、`/portfolio/[id]` | 作品集画廊与详情 | `portfolio_enabled` |
| `/videos`、`/videos/[id]` | 视频列表与详情 | `video_enabled` |
| `/gear` | 器材推荐列表 | `equipment_enabled` |
| `/about` | 关于我（博主资料 + 社交链接） | — |
| `/music` | 音乐播放器 | `music_enabled` |
| `/open-source`、`/open-source/[id]` | 开源作品列表与详情（语言/话题标签/Star 数 + README 渲染 + 仓库/主页外链） | `open_source_enabled` |
| `/recipes`、`/recipes/[id]` | 美食菜谱列表与详情（难度/耗时/份量 + 食材清单 + 编号步骤配图） | `recipe_enabled` |
| `/books`、`/books/[id]` | 读书书架列表与详情（星级/阅读状态徽标 + 书评渲染 + 起止阅读时间） | `book_enabled` |
| `/games`、`/games/[id]` | 游戏库列表与详情（平台/类型/游玩状态/评分(x/10)/时长 + 简评渲染） | `game_enabled` |
| `/fitness` | 健身训练记录列表（日期/类型徽标/时长/千卡） | `fitness_enabled` |
| `/tech-stack` | 技术栈展示（图标/分类/四档熟练度分段条） | `tech_stack_enabled` |

导航与页面展示由后端「模块开关配置」（`/api/v1/public/module-config`）驱动，全量内容模块清单见 `components/nav-modules.tsx`：关闭文章模块会隐藏文章/分类/标签入口，关闭旅行模块会隐藏旅行入口，关闭作品集模块会隐藏作品集入口，关闭视频模块会隐藏视频入口，关闭器材模块会隐藏器材入口，关闭音乐模块会隐藏音乐入口。桌面端平铺前 10 项内容模块（首页固定最前、关于我固定在末尾），第 11 项起收纳进「更多」下拉组，子项随各自模块开关过滤、全关时整个下拉不渲染；移动端菜单与页脚「快速导航」全量展示所有内容模块。

博主「星座 / 性格」展示已接入：数据来自 `/api/v1/public/blogger` 的 `zodiac` / `personality` 字段（未设置或博主关闭展示时不渲染），logo 使用本地静态资源 `/profile-logos/`，展示于关于我页双卡片与首页 Hero 徽章。

旅行攻略详情页在景点含经纬度时嵌入 CMS 地图（`/map-embed/travel/:id`，iframe + postMessage 自适应高度）；历史景点数据无坐标时不渲染地图；景点卡片按坐标系显示对应地图平台跳转 chip（gcj02 → 高德、wgs84/未知 → Google，携带原始坐标新窗口打开，无坐标不显示）。

## 主题切换

- 亮色为默认；导航栏太阳/月亮按钮切换，`localStorage` 记忆，未设置时跟随系统偏好。
- `article.html` 壳页面遵循同一初始化逻辑。

## 本地开发

```bash
pnpm install
cp .env.example .env.local
# 编辑 .env.local，设置 NEXT_PUBLIC_API_BASE_URL 为 novablog API 地址
pnpm dev
```

## 生产构建

```bash
# 发布前自检：清空 API 地址做离线构建（规范 5.5）
NEXT_PUBLIC_API_BASE_URL= pnpm build
grep -r "localhost\|127.0.0.1" dist/ && echo "发现硬编码地址" || echo "自检通过"
```

构建产物输出到 `dist/` 目录。版本号保持 `theme.json`、`package.json` 一致，发布时打 `tech-geek-v{版本}` tag。
