# tech-geek

面向开发者、开源爱好者与硬核技术读者的 novablog 前端主题。亮色为默认主题（蓝色主色），支持一键切换暗色终端风；布局参照「DevNotes」设计稿：暗色 Hero + 文章列表/侧边栏两栏结构。

## 页面结构

| 路由 | 说明 |
|------|------|
| `/` | 首页：Hero（问候语 + 数据统计）+ 最新文章列表 + 侧边栏（博主卡片/热门标签/分类目录/写作激励卡） |
| `/articles` | 文章列表：搜索、分类筛选、标签筛选、分页 |
| `/articles/[slug]` | 文章详情（构建期 SSG 预渲染，未预渲染的由 `public/article.html` 壳页面兜底） |
| `/categories` | 分类目录 |
| `/tags` | 标签云 |
| `/about` | 关于我（博主资料 + 社交链接） |
| `/music` | 音乐播放器 |

导航与页面展示由后端「模块开关配置」（`/api/v1/public/module-config`）驱动：关闭文章模块会隐藏文章/分类/标签入口，关闭音乐模块会隐藏音乐入口。

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
