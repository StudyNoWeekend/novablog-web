# Photo Creator Portfolio — 设计系统

> 面向摄影师个人品牌的深色电影感（Cinematic Dark）沉浸式作品集博客。以全屏 Hero、横向故事墙与克制动效构建“摄影师个人世界入口”。

## 设计原则

1. **沉浸式全屏叙事**：首页与作品集详情页使用全屏背景图 + 深色渐变遮罩，让访客一进入即进入摄影师的视觉世界。
2. **深色电影基底**：以近黑背景 `#050505` 为画布，白色文字与金色强调 `#C9A96E` 形成高对比电影感。
3. **字体层级**：优雅 Serif 标题营造杂志/电影海报气质，Geist Sans 正文保证屏显可读性。
4. **图片绝对主角**：UI 元素克制退后，摄影作品占据视觉中心，所有文字叠加必须依赖渐变遮罩保证可读。
5. **克制动效**：Hero 缓慢缩放、line-reveal、滚动淡入上移；所有动效在 `prefers-reduced-motion: reduce` 下关闭或简化。

## 色彩系统

默认主题为深色电影色板，不再使用浅色 stone。

| Token | 值 | 用途 |
|-------|-----|------|
| `--background` | `#050505` | 页面主背景 |
| `--foreground` | `#FFFFFF` | 主文字、图标 |
| `--card` | `#0a0a0a` | 卡片、浮层背景 |
| `--card-foreground` | `#FFFFFF` | 卡片内文字 |
| `--popover` | `#0a0a0a` | 下拉/弹层背景 |
| `--popover-foreground` | `#FFFFFF` | 弹层文字 |
| `--primary` | `#C9A96E` | 主按钮、强调文字、focus ring、引用边框 |
| `--primary-foreground` | `#050505` | 主按钮文字 |
| `--secondary` | `#141414` | 次要按钮、次级背景 |
| `--secondary-foreground` | `#FFFFFF` | 次要按钮文字 |
| `--muted` | `#141414` | 标签、hover 底色、代码块背景 |
| `--muted-foreground` | `#A1A1AA` | 次要说明文字 |
| `--accent` | `#1a1a1a` | 选中态、轻量强调背景 |
| `--accent-foreground` | `#FFFFFF` | 选中态文字 |
| `--destructive` | `#ef4444` | 错误提示 |
| `--border` | `rgba(255,255,255,0.1)` | 分割线、边框、细线 |
| `--input` | `rgba(255,255,255,0.1)` | 输入框边框 |
| `--ring` | `#C9A96E` | focus-visible 光环 |

### 色板扩展

- 金色强调：`#C9A96E`，用于主按钮、hover 高亮、引用左边框、杂志编号 Logo。
- 中性灰阶：`#A1A1AA`（次要文字）、`#71717A`、`#52525B`、`#3F3F46`（图表/装饰）。
- 遮罩渐变：全屏 Hero 使用从底部或四周向内的黑色渐变，如 `bg-gradient-to-t from-black/80 via-black/20 to-transparent`，确保文字可读。

## 字体系统

- **标题字体**：`Cormorant Garamond`（Next.js Google Fonts），CSS 变量 `--font-heading`。
  - 用于 Hero 宣言、页面大标题、杂志编号 Logo、Quote 引用。
  - 字重范围：400/500/600/700，默认标题避免使用 700，优先 400–500 营造优雅感。
- **正文字体**：`Geist Sans`（Next.js Google Fonts），CSS 变量 `--font-geist-sans`。
  - 用于正文、导航、按钮、卡片说明、表单。
- **等宽字体**：`Geist Mono`，用于代码块与技术标签。
- **备用栈**：`ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`。

### 字号层级

| 元素 | 桌面 | 移动端 | 字重 | 行高 |
|------|------|--------|------|------|
| Hero 宣言 | `text-5xl`/`6xl` | `text-3xl`/`4xl` | `font-light`/`font-normal` | `leading-tight` |
| 页面标题 | `text-4xl`/`5xl` | `text-2xl`/`3xl` | `font-normal` | `leading-tight` |
| 区块标题 | `text-2xl`/`3xl` | `text-xl`/`2xl` | `font-medium` | `leading-snug` |
| 正文 | `text-base` | `text-base` | `font-normal` | `leading-relaxed` (1.75) |
| 辅助说明 | `text-sm` | `text-sm` | `font-normal` | `leading-relaxed` |
| 极小标签 | `text-xs` | `text-xs` | `font-medium` | `leading-normal` |

- 标题字体使用 `font-heading`；正文使用默认 `font-sans`。
- 正文颜色使用 `text-foreground/90` 降低锐利度。
- Hero 与 Quote 文字通常叠加在图片上，必须配合遮罩使用 `text-white` 或 `text-foreground`。

## 间距系统

- 页面最大宽度：`max-w-7xl`（1280px），居中对 `mx-auto`。
- 水平内边距：`px-4 sm:px-6 lg:px-8`。
- 区块纵向间距：`py-20 md:py-28 lg:py-32`。
- 卡片间距：`gap-6 md:gap-8`。
- 组件内部间距：`gap-4`。
- 全屏 Hero 区域不使用容器限制，内容区仍套 `max-w-7xl` 居中。

## 布局

### 响应式断点

- `375px`：单列、全宽图片、隐藏导航为汉堡菜单。
- `768px`：双列网格、导航展开。
- `1024px`：三列网格、更大的留白。
- `1440px`：最大容器居中，图片保持高分辨率。

### 网格

- 作品集列表：`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`。
- 文章列表：`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`。
- 瀑布流画廊：使用 CSS columns（`columns-1 md:columns-2 lg:columns-3 gap-4`），图片 `break-inside-avoid`。
- 横向故事墙：使用横向 flex/scroll 容器，桌面端隐藏滚动条，支持拖拽/滚轮横向浏览。

## 组件样式

### 按钮

- 主按钮：`bg-primary text-primary-foreground hover:bg-primary/90`，圆角 `rounded-lg`，内边距 `h-9 px-4`。
- 次要/幽灵：`border-border bg-transparent hover:bg-muted hover:text-foreground`。
- 播放按钮（Hero）：带圆形边框 + “▶ WATCH MY JOURNEY” 文案，hover 边框变 primary。
- 所有按钮具备 `focus-visible:ring-2 focus-visible:ring-ring`。

### 卡片

- 背景 `bg-card`，圆角 `rounded-xl`，细边框 `border`。
- 图片容器 `aspect-*`，overflow hidden，hover 时图片 `scale-105`（300ms）。
- 文字区域 `p-5`。
- 在深色背景下，卡片 hover 可叠加 `bg-card/80 backdrop-blur-sm` 提升层次。

### 输入框

- 背景 `bg-background`，边框 `border-input`，圆角 `rounded-lg`。
- focus：`focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30`。
- 占位符 `placeholder:text-muted-foreground/60`。

### 图片

- 统一使用 Next.js `<Image unoptimized />`，支持懒加载。
- 占位：`bg-muted` + 居中图标。
- 所有图片提供有意义 `alt`。
- 文章正文图片带 `rounded-xl shadow-sm shadow-black/40`，在深色背景上保持轮廓感。

### 导航

- 首页 Hero 区域：透明背景，覆盖在背景图上，顶部细线 `border-b border-white/10`。
- 滚动后：切换为实心深色顶栏 `bg-background/95 backdrop-blur-md`。
- 标签使用杂志编号风格：`01 WORK`、`02 STORIES`、`03 JOURNAL`、`04 ABOUT`、`05 CONTACT`。
- 移动端保持汉堡菜单。

### 页脚

- 大字号 CTA：`LET'S CREATE A STORY TOGETHER`，使用 Serif 标题字体。
- 服务类型标签：Editorial / Travel / Documentary。
- 邮箱与版权信息，居中或居左极简布局。
- 背景 `bg-background`，顶部细线 `border-t border-border`。

## 动效

- 微交互时长：`150ms–300ms`，缓动 `ease-out`。
- hover 缩放：`scale-105`，使用 `transform` 避免重排。
- Hero 背景缩放：`scale(1) → scale(1.08)`，约 20s，linear/infinite alternate。
- 文字 line-reveal：clip-path 或 translateY 动画，stagger 100–150ms。
- 页面进入：opacity 0→1，translateY 16px→0，duration 600ms，outQuart。
- 骨架屏：`animate-pulse bg-muted`。
- 尊重 `prefers-reduced-motion`：在 `@media (prefers-reduced-motion: reduce)` 下关闭过渡与动画。

## 反模式清单

- ❌ 不使用浅色 stone 背景作为默认主题。
- ❌ 不使用 emoji 作为图标，统一使用 Lucide React。
- ❌ 不在图片上叠加高饱和装饰色块。
- ❌ 不使用大段居中正文（降低可读性）。
- ❌ 不将 hover scale 用于布局元素，避免抖动。
- ❌ 不使用 `font-bold` 作为标题默认字重（标题优先 `font-light`/`font-normal`）。
- ❌ 不将分类/标签做成喧闹的彩色胶囊，使用 muted 背景。
- ❌ 避免在高透明度玻璃层上使用低对比文字；玻璃层必须配合足够深的底色或渐变。
- ❌ 避免 Hero 文字被复杂背景图干扰，必须保证渐变遮罩覆盖。
- ❌ 避免使用纯黑 `#000000` 作为大面积背景，使用 `#050505` 减少生硬感。

## 无障碍

- 所有交互元素：`cursor-pointer` + 可见 focus ring（`ring-primary`）。
- 表单字段带 `<label>` 或 `aria-label`。
- 图标按钮带 `aria-label`。
- 图片提供 `alt`；装饰性图片使用空 `alt`。
- 颜色对比度 ≥ 4.5:1；Hero 文字必须依赖遮罩达到对比度要求。
- 动画尊重 `prefers-reduced-motion`。
