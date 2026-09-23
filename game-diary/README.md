# game-diary · 游戏日记

面向游戏爱好者的暗色霓虹风 NovaBlog 博客主题。深夜蓝紫基调 + 紫品红渐变，覆盖游戏实况视频、攻略文章与游戏库三大内容模块，全模块对接 CMS 公开接口并遵循 module-config 模块开关。

## 页面结构

| 路由 | 说明 | 数据来源 |
|---|---|---|
| `/` | 首页：Hero 主视觉、最新视频、热门游戏分类、关于我卡片、CTA 横幅 | blogger / videos / categories / equipments / module-config |
| `/videos` | 游戏视频列表，支持关键词搜索与分页，卡片跳转视频平台 | videos |
| `/articles` | 攻略文章列表：分类筛选、关键词搜索、热门榜、标签云、分页 | articles / categories / tags |
| `/articles/[slug]` | 文章详情：封面大图、Markdown 正文、评论（两级回复）、浏览计数上报 | articles / comments |
| `/games` | 游戏库列表（复用器材模块：游戏名/封面/厂商/介绍） | equipments |
| `/games/[id]` | 游戏详情 + 「查找相关攻略文章」入口 | equipments |
| `/about` | 关于我：头像、简介、标签、合作邮箱、文章/视频/游戏统计、社交链接 | blogger / articles / videos / equipments |

## 主题特性

- **暗色霓虹设计**：深夜蓝紫背景 + 紫→品红渐变主色（`#8b5cf6 → #ec4899`），Nunito 圆体标题字；
- **模块开关**：导航与首页区块随 `module-config` 动态显隐（视频/文章/游戏库）；
- **壳页面兜底**：`public/article.html`、`public/game.html` 为自包含壳页面，未预渲染的详情 URL 由 CMS 托管器兜底到壳页面客户端取数渲染（含 XSS 转义、安全 URL、slug 解析容错与错误态）；
- **评论区**：文章详情支持访客评论与两级回复，壳页面与预渲染页行为一致；
- **浏览计数**：静态导出后由客户端 `ViewTracker` 挂载上报；
- **构建期容错**：全部取数函数 catch 后回退空数据，`generateStaticParams` 失败时使用占位 slug 并短路（不依赖后端可达）。

## 本地开发

```bash
pnpm install
pnpm dev            # 需要 .env.local 指向后端（参考 .env.local.example）
```

## 发布

遵循仓库根 [docs/theme-spec.md](../docs/theme-spec.md)，三处版本一致后打 tag：

```bash
git tag game-diary-v0.1.0 && git push origin game-diary-v0.1.0
```

发布前离线自检：

```bash
NEXT_PUBLIC_API_BASE_URL= pnpm build
```
