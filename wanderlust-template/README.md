# wanderlust-template（漫游世界）

面向旅行爱好者的清新手账风 novablog 前端主题：暖白底 + 墨绿主色 + 手写体点缀，布局参照「WanderLina」旅行博客设计稿：全幅 Hero + 分类磁贴 + 最新游记/博主卡两栏结构。

## 页面结构

| 路由 | 说明 |
|------|------|
| `/` | 首页：Hero（去看更大的世界 + 目的地搜索）+ 分类磁贴 + 最新游记 + 侧边栏（博主卡片/热门文章）+ 下一站 CTA |
| `/destinations` | 目的地：按目的地聚合全部已发布攻略，点击进入按关键词筛选的攻略列表 |
| `/articles` | 游记列表：搜索、分类筛选、分页 + 侧边栏（热门文章/标签云） |
| `/articles/[slug]` | 游记详情（构建期 SSG 预渲染，未预渲染的由 `public/article.html` 壳页面兜底） |
| `/travels` | 旅行攻略列表：搜索、天数筛选、排序、分页 |
| `/travels/[id]` | 攻略详情（景点/行程/评价 + 点赞，未预渲染的由 `public/travel.html` 壳页面兜底） |
| `/gear` | 旅行装备列表：搜索 |
| `/gear/[id]` | 装备详情（构建期 SSG 预渲染） |
| `/about` | 关于我（博主资料 + 标签 + 社交链接） |

导航与页面展示由后端「模块开关配置」（`/api/v1/public/module-config`）驱动：关闭文章模块会隐藏游记入口，关闭旅行模块会隐藏目的地/攻略入口，关闭器材模块会隐藏装备入口。

## 对接的公开接口

与 lens-life-template 完全一致的数据层（`lib/api/*`）：`blogger`、`articles`（列表/详情/hot/random/view）、`categories`、`tags`、`comments`（列表/发表）、`travels`（列表/详情/hot/view/like）、`equipments`、`module-config`。统一走 `lib/api/client.ts` 三级回退（theme-config.js 注入 → 环境变量 → 同域相对路径），全部取数函数失败时回退空数据。

## 本地开发

```bash
pnpm install
cp .env.local.example .env.local
# 编辑 .env.local，设置 NEXT_PUBLIC_API_BASE_URL 为 novablog API 地址
pnpm dev
```

## 生产构建

```bash
# 发布前自检：清空 API 地址做离线构建（规范 5.5）
NEXT_PUBLIC_API_BASE_URL= pnpm build
grep -r "localhost\|127.0.0.1" dist/ && echo "发现硬编码地址" || echo "自检通过"
```

构建产物输出到 `dist/` 目录。版本号保持 `theme.json`、`package.json` 一致，发布时打 `wanderlust-template-v{版本}` tag。
