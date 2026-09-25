# media-diary（多媒体日记）

明亮黄奶油风格的 novablog 前端主题模板：奶油底色、舞台黄点缀、深墨色页头页脚、手写体标题与拍立得相框，面向多媒体运营博主与内容创作者。

当前版本 **v0.1.0**，发布 tag 为 `media-diary-v0.1.0`。

## 功能模块

| 路由 | 说明 | 模块开关 |
|---|---|---|
| `/` | 首页：深色照片背景主视觉（手写标语、内容形式标签行、竖排「记录 创造 分享」）、关于我（拍立得头像 + 作品数据卡）、我的内容领域（四张粉彩领域卡）、近期作品 | — |
| `/works` | 作品展示：视频作品网格（封面、平台角标，点击新窗口打开第三方平台页面）、关键词搜索、分页 | `video_enabled` |
| `/articles`、`/articles/[slug]` | 内容专栏列表与详情：分类筛选、关键词搜索、人气榜、标签云、评论与浏览量统计 | `article_enabled` |
| `/music` | 音乐时刻：歌曲列表（底部播放条，B 站外链 iframe 播放）+ 第三方歌单 | `music_enabled` |
| `/about` | 关于我：拍立得头像、博主标签、联系方式、社交链接 | — |
| `/contact` | 合作联系：合作方向卡片（品牌合作 / 内容定制 / 朋友来信）、联系方式、社交链接 | — |

模块开关由 CMS 的 `/public/module-config` 下发：构建时读取一次作为兜底，浏览器端运行时再次获取，隐藏被关闭的导航项并让对应页面显示禁用提示。页脚展示主题版本号与 `theme.json` 中的源码仓库链接（主题来源链接）。

## 音乐播放器细节

与全主题统一的底部播放条方案一致（参考 lens-life-template）：

- 音源为 B 站官方外链播放器，iframe 仅作隐藏音频引擎（1px 透明，不展示视频画面），`allow="autoplay; fullscreen; encrypted-media"`；
- 跨域 iframe 无法监听播放事件，进度按歌曲时长前端估算（墙钟基点 + 秒级推进），到达后按播放模式自动切歌；
- 播放/暂停通过重载 iframe 实现（`autoplay=0/1` + `t` 定位），拖拽进度松手后跳转；
- 支持顺序 / 随机 / 单曲循环三种模式循环切换、上/下一首、关闭与失败重试；播放期间为页面流补等高占位，避免遮挡页脚。

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

后端不可达时构建依然可通过：文章详情页在构建期拉取 slug 列表，拉取失败或为空时生成 `__fallback__` 占位页；未被预渲染的动态路径由 `theme.json` 的 `routes.fallback` 兜底到 `dist/article.html` 壳页面，由 CMS 托管层在运行时返回。壳页面与预渲染详情页体验一致：遵循文章的 `is_comment` 开关，内置评论区（评论列表、两级回复、发表表单）与浏览计数上报；正文对富文本（HTML）做白名单净化、对 Markdown 先整体转义再解析，两种路径均防 XSS。

## 本地视觉验收工具（可选）

使用仓库根目录的通用脚本（不进入发布制品）：

```bash
# 1. mock API：覆盖全部主题消费的公开接口，默认端口 8222
node scripts/mock-server.mjs

# 2. 托管 dist/ 并模拟 CMS 解析顺序与壳页面兜底，默认端口自定；/api/v1 代理到 mock
NEXT_PUBLIC_API_BASE_URL= pnpm build
THEME_DIR="$PWD/media-diary" SERVE_PORT=8309 node scripts/serve-dist.mjs
```

整站页面截图存档见 `docs/screenshots/media-diary/`。

## 技术栈

- Next.js 15 + App Router
- TypeScript
- Tailwind CSS
- lucide-react
