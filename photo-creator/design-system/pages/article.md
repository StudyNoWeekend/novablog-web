# Article 页面设计覆盖

> 文章列表页与详情页的视觉与交互规范（深色电影主题适配）。

## 通用深色适配原则

- 背景统一使用 `bg-background`（`#050505`），文字使用 `text-foreground`（`#FFFFFF`）。
- 所有边框、分割线使用 `border-border`（`rgba(255,255,255,0.1)`），在深色背景上保持可见但克制。
- 正文链接 hover 使用 `text-primary`，替代浅色主题下的 `text-muted-foreground`，确保在深色背景上清晰可辨。
- 引用块左边框使用 `border-primary`（`#C9A96E`），与深色主题一致。

## 文章列表页 (`/articles`)

- **头部**：页面标题 + 搜索框 + 分类筛选，搜索框 `max-w-md`，圆角 `rounded-full`。
- **搜索框**：
  - 背景 `bg-background`，边框 `border-input`，focus 时 `border-primary ring-primary/30`。
  - 占位符 `placeholder:text-muted-foreground/60`。
- **卡片**：
  - 背景 `bg-card`，细边框 `border`，圆角 `rounded-xl`。
  - 封面图 `aspect-[16/10]`，hover `scale-105`。
  - 标题 `text-lg font-medium`，最多两行，颜色 `text-foreground`。
  - 摘要 `text-sm text-muted-foreground` 最多三行。
  - 元信息：分类标签、阅读量、评论数，使用 `text-xs` + muted 颜色。
- **网格**：`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8`。

## 文章详情页 (`/articles/[slug]`)

- **Hero 封面**：全宽或接近全宽，`aspect-[21/9] md:aspect-[21/8]`，object-cover。
- **标题区**：标题下方展示分类、发布时间、阅读量、评论数，使用分隔符 `·`。
- **正文区**：
  - 最大宽度 `max-w-3xl`，居中，`text-lg leading-relaxed`。
  - 段落间距 `mb-6`，标题 `mt-10 mb-4`。
  - 图片圆角 `rounded-xl`，带 subtle 阴影 `shadow-sm shadow-black/40`，在深色背景上保持轮廓。
  - 引用块左侧 `border-l-2 border-primary pl-5 italic text-muted-foreground`。
  - 代码块 `bg-muted rounded-lg p-4 text-sm font-mono`。
- **评论区**：
  - 位于正文下方，`max-w-3xl` 居中。
  - 评论表单位于列表上方或“回复”按钮下方。
  - 嵌套评论使用左侧 `pl-6 border-l border-border` 缩进。
  - 输入框、按钮均使用深色主题语义 token。
