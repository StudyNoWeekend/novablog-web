# Portfolio 页面设计覆盖

> 作品集列表页与详情页的视觉与交互规范（深色电影主题适配）。

## 通用深色适配原则

- 背景统一使用 `bg-background`（`#050505`），文字使用 `text-foreground`（`#FFFFFF`）。
- 所有边框、分割线使用 `border-border`（`rgba(255,255,255,0.1)`），确保在深色背景上可见但不过于抢眼。
- 叠加在图片上的文字必须配合深色渐变遮罩，保证对比度 ≥ 4.5:1。
- hover 状态优先使用 `text-primary`、`border-primary` 或 `bg-muted`，不使用高饱和冷色。

## 作品集列表页 (`/portfolios`)

- **头部**：简洁页面标题 + 分类筛选，标题下方仅一行描述，不堆砌信息。
- **网格**：`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8`。
- **卡片**：
  - 封面图占主导地位，`aspect-[4/3]` 或 `aspect-square`，根据 `cover_mode` 决定。
  - 背景 `bg-card`，细边框 `border`，圆角 `rounded-xl`。
  - hover 时图片 `scale-105`，叠加 5%–15% 深色遮罩提升质感与文字可读性。
  - 作品数量使用小字标签，位于图片角落或标题旁，颜色 `text-muted-foreground`。
- **空态**：一张占位图 + “暂无作品集” 文案，居中展示，使用 `text-muted-foreground`。

## 作品集详情页 (`/portfolios/[id]`)

- **全屏封面 Hero**：
  - 使用作品集 `cover_url` 作为全屏背景，`object-cover`，占满首屏。
  - 覆盖深色渐变遮罩：`bg-gradient-to-t from-black/80 via-black/40 to-black/30`，确保标题可读。
  - 标题使用 Serif 标题字体 `font-heading`，`text-4xl md:text-5xl lg:text-6xl`，白色。
  - 展示作品名称、地点、年份、描述；元信息使用 `text-sm text-white/80` 或 `text-muted-foreground`。
  - 向下滚动提示：底部居中箭头或 “SCROLL TO EXPLORE” 微标签。
- **画廊**：使用 CSS columns 瀑布流 (`columns-1 md:columns-2 lg:columns-3 gap-4`)，图片 `break-inside-avoid`。
- **Lightbox**：
  - 点击任意图片进入全屏遮罩，背景 `bg-black/95`。
  - 左右箭头切换（键盘 ← → 支持），ESC 关闭。
  - 显示当前图片序号与标题。
- **图片项**：
  - 若 `title` 或 `description` 存在，overlay 在图片底部展示，hover 时显现。
  - overlay 背景使用 `bg-gradient-to-t from-black/80 to-transparent`，文字 `text-white`。

## 分类筛选

- 筛选器使用横向滚动胶囊（`overflow-x-auto`），隐藏滚动条。
- 当前选中 `bg-primary text-primary-foreground`，其余 `bg-muted text-foreground hover:bg-muted/80`。
- 选中后更新 URL `?category_id=xxx`，保留浏览器后退行为。
- 胶囊边框可选 `border border-border` 增强深色背景下的轮廓感。
