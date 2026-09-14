# NovaBlog Themes

NovaBlog CMS 官方主题仓库。每个子目录是一个独立的博客主题（Next.js 静态导出工程），按[《主题包规范》](./docs/theme-spec.md)构建为 `.tar.gz` 制品并发布到 GitHub Release，供 NovaBlog CMS 后台一键安装、托管与切换。

## 主题列表

| 主题 | 目录 | 状态 | 简介 |
|---|---|---|---|
| 极客风 | [tech-geek](./tech-geek) | 已上架 v0.1.0 | 面向开发者、开源爱好者与硬核技术读者的深色极客风格 |
| 明快创作 | [media-creator](./media-creator) | 待规范改造 | 面向视频观众与社交媒体追随者的明亮活泼风格内容主页 |
| 光影集 | [photo-creator](./photo-creator) | 待规范改造 | 面向摄影爱好者与视觉内容消费者的高留白、图片优先作品集博客 |
| lens-life | [lens-life-template](./lens-life-template) | 待规范改造（现为 SSR，需改造为静态导出） | 生活影像风格 |

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
