# game-diary · 游戏日记

面向游戏爱好者的暗色霓虹风 NovaBlog 博客主题。深夜蓝紫基调 + 紫品红渐变，覆盖游戏实况视频、攻略文章、游戏库及开源作品、美食菜谱、读书书架、健身训练、技术栈等内容模块，全模块对接 CMS 公开接口并遵循 module-config 模块开关。

## 页面结构

| 路由 | 说明 | 数据来源 | 模块开关 |
|---|---|---|---|
| `/` | 首页：Hero 主视觉、最新视频、热门游戏分类、关于我卡片、CTA 横幅 | blogger / videos / categories / games / module-config | — |
| `/videos` | 游戏视频列表，支持关键词搜索与分页，卡片跳转视频平台 | videos | `video_enabled` |
| `/articles` | 攻略文章列表：分类筛选、关键词搜索、热门榜、标签云、分页 | articles / categories / tags | `article_enabled` |
| `/articles/[slug]` | 文章详情：封面大图、Markdown 正文、评论（两级回复）、浏览计数上报 | articles / comments | `article_enabled` |
| `/games` | 游戏库列表：游玩状态筛选（想玩/在玩/玩过）、关键词搜索、评分（x/10） | games | `game_enabled` |
| `/games/[id]` | 游戏详情：平台/类型/时长/短评 + 「查找相关攻略文章」入口 | games | `game_enabled` |
| `/music` | 游戏音乐：歌曲列表（右下角悬浮播放器，B 站外链 iframe 播放）+ 第三方歌单 | music / playlists | `music_enabled` |
| `/open-source`、`/open-source/[id]` | 开源作品列表与详情，渲染 Markdown README、仓库与主页外链 | open-sources | `open_source_enabled` |
| `/recipes`、`/recipes/[id]` | 美食菜谱列表与详情，含难度筛选、食材清单与编号步骤图 | recipes | `recipe_enabled` |
| `/books`、`/books/[id]` | 读书书架列表与详情，含阅读状态筛选、星级与 Markdown 书评 | books | `book_enabled` |
| `/fitness` | 健身训练记录列表，含训练类型筛选（仅列表页） | fitness | `fitness_enabled` |
| `/tech-stack` | 技术栈列表，含熟练度筛选与 4 档进度展示（仅列表页） | tech-stacks | `tech_stack_enabled` |
| `/about` | 关于我：头像、简介、标签、合作邮箱、文章/视频/游戏统计、社交链接 | blogger / articles / videos / games | — |

模块开关由 CMS 的 `/public/module-config` 下发：构建时读取一次作为兜底，浏览器端运行时再次获取，隐藏被关闭的导航项并让对应页面显示禁用提示。六个新模块入口统一收纳在导航「更多」下拉与移动端「更多功能」小节中，随开关过滤；页脚同步展示对应链接。

## 主题特性

- **暗色霓虹设计**：深夜蓝紫背景 + 紫→品红渐变主色（`#8b5cf6 → #ec4899`），Nunito 圆体标题字；
- **模块开关**：导航与首页区块随 `module-config` 动态显隐（视频/文章/游戏库及六个「更多」模块），新模块入口收纳在导航「更多」下拉、移动端「更多功能」小节与页脚链接中；
- **壳页面兜底**：`public/article.html`、`public/open-source.html`、`public/recipe.html`、`public/book.html`、`public/game.html` 为自包含壳页面，未预渲染的详情 URL 由 CMS 托管器兜底到壳页面客户端取数渲染（含 XSS 转义、安全 URL、slug 解析容错与错误态）；
- **评论区**：文章详情支持访客评论与两级回复，壳页面与预渲染页行为一致；
- **浏览计数**：静态导出后由客户端 `ViewTracker` 挂载上报；
- **博主星座/性格**：已接入博主星座/性格展示（本地 logo，关于我页名片卡 + 首页 Hero 徽章）；
- **构建期容错**：全部取数函数 catch 后回退空数据，`generateStaticParams` 失败时使用占位 slug 并短路（不依赖后端可达）。

## 本地开发

```bash
pnpm install
pnpm dev            # 需要 .env.local 指向后端（参考 .env.local.example）
```

## 发布

遵循仓库根 [docs/theme-spec.md](../docs/theme-spec.md)，三处版本一致后打 tag：

```bash
git tag game-diary-v0.5.0 && git push origin game-diary-v0.5.0
```

发布前离线自检：

```bash
NEXT_PUBLIC_API_BASE_URL= pnpm build
```
