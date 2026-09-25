# NovaBlog Themes

NovaBlog CMS 官方主题仓库。每个子目录是一个独立的博客主题（Next.js 静态导出工程），按[《主题包规范》](./docs/theme-spec.md)构建为 `.tar.gz` 制品并发布到 GitHub Release，供 NovaBlog CMS 后台一键安装、托管与切换。

## 主题列表

| 主题 | 目录 | 状态 | 简介 |
|---|---|---|---|
| 极客风 | [tech-geek](./tech-geek) | 已上架 v0.3.0 | 面向开发者与硬核技术读者的亮暗双主题技术博客 |
| 明快创作 | [media-creator](./media-creator) | 已上架 v0.1.0 | 面向视频观众与社交媒体追随者的明亮活泼风格内容主页 |
| 光影集 | [photo-creator](./photo-creator) | 已上架 v0.1.0 | 面向摄影爱好者与视觉内容消费者的高留白、图片优先作品集博客 |
| 镜头生活 | [lens-life-template](./lens-life-template) | 已上架 v1.0.4 | 风光、城市、人文与航拍的暗色优雅摄影生活博客 |
| 漫游世界 | [wanderlust-template](./wanderlust-template) | 已上架 v0.1.0 | 面向旅行爱好者的清新手账风旅行博客：目的地、游记、攻略与装备 |
| 旋律笔记 | [melody-notes](./melody-notes) | 开发中 v0.1.0 | 面向音乐博主与耳机党的暗色治愈系音乐博客：今日推荐、歌曲榜、歌单与音乐文章 |
| 游戏日记 | [game-diary](./game-diary) | v0.1.0 | 面向游戏爱好者的暗色霓虹风博客主题：游戏实况视频、攻略文章与游戏库 |
| 美食日记 | [food-diary](./food-diary) | 开发中 v0.1.0 | 面向美食博主与生活记录者的温暖手账风博客：美食日记、菜谱分享、旅行美食与关于我 |
| 漫画日记 | [manga-diary](./manga-diary) | 开发中 v0.1.0 | 面向漫画家与绘画创作者的温暖手绘风博客：漫画作品、创作动态、音乐分享与关于我 |
| 多媒体日记 | [media-diary](./media-diary) | 开发中 v0.1.0 | 面向多媒体运营博主与内容创作者的明亮黄奶油风博客：视频作品、图文专栏、音乐分享与关于我 |
| 次元日记 | [anime-diary](./anime-diary) | 开发中 v0.1.0 | 面向二次元博主的粉紫梦幻动漫风博客：动漫推荐、游戏心得、插画作品、音乐分享与生活日常 |

主题改造清单与准入标准见[《主题包规范》第九章](./docs/theme-spec.md)。

## 博主：安装主题

NovaBlog CMS 后台 → 主题 → 官方市场（或首装向导），选择主题与版本即可安装激活。制品由本仓库的 Release CI 自动产出，无需手动下载。

## 主题作者：三步上架

1. **读规范**：[docs/theme-spec.md](./docs/theme-spec.md) —— theme.json 清单、静态导出工程要求、壳页面与打包规则；
2. **提主题**：仓库根新建目录（**目录名即主题 id**，全局唯一），内含 `theme.json` + 符合规范的 Next.js 静态导出工程，提交 PR；
3. **发版本**：PR 合入后打主题级 tag 触发发布：

   ```bash
   git tag tech-geek-v0.1.0 && git push origin tech-geek-v0.1.0
   ```

## 发布规则（摘要）

- **tag**：`{主题目录名}-v{语义化版本}`，一个 tag 只发布一个主题，新增主题**无需修改任何 CI 文件**；
- **制品**：`{主题目录名}-{版本}.tar.gz`（+ `.sha256`），由 CI 自动打包并挂载到对应 Release；
- **版本一致性**：`tag 版本 == theme.json version == package.json version`，由 CI 强制校验，不一致直接构建失败；
- **CMS 匹配**：CMS 只按资产名 `{目录名}-{版本}.tar.gz` 匹配制品，tag 命名不影响安装链路。

## License

[MIT](./LICENSE)
