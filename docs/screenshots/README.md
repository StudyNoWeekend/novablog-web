# 主题页面截图索引

全部 8 个官方主题基于 **mock 数据** 渲染的整站页面截图（1440×900，共 70 页），用于主题效果预览与视觉验收存档。

## 截图总览

| 主题 | 目录 | 页面数 | 风格 |
|---|---|---|---|
| 极客风 | [tech-geek](./tech-geek) | 14 | 亮暗双主题技术博客 |
| 明快创作 | [media-creator](./media-creator) | 7 | 深色影院感影像创作 |
| 光影集 | [photo-creator](./photo-creator) | 5 | 高留白图片优先作品集 |
| 镜头生活 | [lens-life-template](./lens-life-template) | 12 | 暗色优雅摄影生活 |
| 漫游世界 | [wanderlust-template](./wanderlust-template) | 10 | 清新手账风旅行博客 |
| 旋律笔记 | [melody-notes](./melody-notes) | 6 | 暗色治愈系音乐博客 |
| 游戏日记 | [game-diary](./game-diary) | 8 | 暗色霓虹风游戏博客 |
| 美食日记 | [food-diary](./food-diary) | 8 | 温暖手账风美食博客 |

每个主题目录内以 `01-home`、`02-articles`、`03-article-detail`… 命名，覆盖首页、全部列表页、详情页（文章/旅行/作品集/视频/器材/游戏库）与关于页等。

## 截图环境

- 数据源：`scripts/mock-server.mjs` 提供的本地 mock API（覆盖全部公开接口：博主、文章、旅行、作品集、视频、音乐、器材/游戏库、评论等），图片使用 picsum.photos 随机占位图；
- 构建：各主题在 mock API 可达时执行 `pnpm build` 静态导出（详情页 SSG 需要构建期拉取 mock 数据）；
- 托管：`scripts/serve-dist.mjs` 静态托管 dist 产物（含 theme.json 壳页面 fallback 与 API 代理）；
- 截图：Chromium headless（`--virtual-time-budget=15000` 等待图片加载完成）。

## 本地复现步骤

```bash
# 1. 启动 mock API（端口 8222）
node scripts/mock-server.mjs

# 2. 构建（示例：food-diary；其余主题同理）
cd food-diary
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8222 pnpm build
cd ..

# 3. 静态托管 dist（端口自定）
THEME_DIR="$PWD/food-diary" SERVE_PORT=8308 node scripts/serve-dist.mjs

# 4. 浏览器打开 http://127.0.0.1:8308 验收
```
