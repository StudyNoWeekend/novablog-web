# melody-notes（旋律笔记）

面向音乐博主与耳机党的暗色治愈系 novablog 前端主题：深夜墨绿底 + 薄荷绿点缀 + 手写体标语，布局参照「Melody Notes」音乐博客设计稿：全幅 Hero + 今日推荐（主打歌 + 曲目榜）+ 侧栏博主卡/热门歌单 + 最新文章。

## 页面结构

| 路由 | 说明 |
|------|------|
| `/` | 首页：Hero（用音乐记录生活的每一种情绪 + 探索我的歌单）+ 今日推荐（换一换洗牌 + 点击播放）+ 最新文章 + 侧栏（博主卡片/热门歌单） |
| `/music` | 音乐推荐：歌曲搜索、曲目列表，点击即播（导航栏迷你播放器接管上下曲） |
| `/playlists` | 歌单：第三方歌单卡片墙，点击跳转对应平台 |
| `/articles` | 文章列表：搜索、分类筛选、分页 + 侧栏（热门文章/分类） |
| `/articles/[slug]` | 文章详情（构建期 SSG 预渲染，未预渲染的由 `public/article.html` 壳页面兜底） |
| `/about` | 关于我（博主资料 + 文章/歌曲/歌单统计 + 社交链接） |

导航与页面展示由后端「模块开关配置」（`/api/v1/public/module-config`）驱动：关闭音乐模块会隐藏音乐推荐/歌单入口与相关板块，关闭文章模块会隐藏文章入口与相关板块。

音乐播放：全局 `MusicPlayerProvider` 挂在根布局，任意页面点击歌曲后由导航栏迷你播放器接管，歌曲音频直链走 `GET /api/v1/public/music/audio-url/{id}`（B 站 CDN，带超时与失败态）。

页脚：左侧手写体标语「Good Music, Better Life ♪」+ 声波装饰；右侧「订阅我的更新」表单（无后端订阅接口，提交时组装邮件交由访客邮件客户端发送，未配置邮箱时降级为社交链接）；底部含**主题来源链接**（`theme.json` 的 `homepage`，即 novablog-web/melody-notes）与版本号。

## 对接的公开接口

与 lens-life-template 一致的数据层（`lib/api/*`）：`blogger`、`articles`（列表/详情/hot/random/view）、`categories`、`tags`、`comments`（列表/发表）、`music`（songs/audio-url/playlists）、`module-config`。统一走 `lib/api/client.ts` 三级回退（theme-config.js 注入 → 环境变量 → 同域相对路径），全部取数函数失败时回退空数据。

## 本地开发

```bash
pnpm install
cp .env.local.example .env.local
# 编辑 .env.local，设置 NEXT_PUBLIC_API_BASE_URL 为 novablog API 地址
pnpm dev
```

没有可用的后端时，可以用仓库内的 Mock CMS 做静态产物联调（模拟同域托管 + `/articles/*` 壳页面兜底 + 参照设计稿的示例数据，仅本地使用、不进入制品）：

```bash
NEXT_PUBLIC_API_BASE_URL= pnpm build   # 离线构建
node mock-cms-server.mjs 3300          # 打开 http://localhost:3300
```

## 生产构建

```bash
# 发布前自检：清空 API 地址做离线构建（规范 5.5）
NEXT_PUBLIC_API_BASE_URL= pnpm build
grep -r "localhost\|127.0.0.1" dist/ && echo "发现硬编码地址" || echo "自检通过"
```

构建产物输出到 `dist/` 目录。版本号保持 `theme.json`、`package.json` 一致，发布时打 `melody-notes-v{版本}` tag。
