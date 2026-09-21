# Tech Geek Blog 设计系统

> 面向开发者、开源爱好者与硬核技术读者的技术博客。亮色为默认主题，暗色保留终端/代码风格，通过导航栏按钮切换。

## 设计定位

- **产品类型**: 技术博客 / 开发者个人站点
- **风格关键词**: developer, engineering, clean, blue accent, terminal heritage
- **情感**: 专业、冷静、精确、极客
- **模式**: 双主题（亮色默认 + 暗色可切换，localStorage 记忆 + 系统偏好兜底）；主色蓝色系，终端绿保留为 accent
- **字体**: Geist Sans 正文，monospace（Geist Mono）用于代码、标签与品牌名

## 配色

### 亮色主题（默认，`:root`）

| Token | 值 | 用途 |
|-------|-----|------|
| `--background` | `#f8fafc` | 主背景 |
| `--foreground` | `#0f172a` | 主文字 |
| `--card` | `#ffffff` | 卡片/面板背景 |
| `--muted` | `#f1f5f9` | muted 背景 |
| `--muted-foreground` | `#475569` | 次级文字 |
| `--border` / `--input` | `#e2e8f0` | 边框/输入框 |
| `--primary` | `#2563eb` | 主按钮/链接/高亮 |
| `--primary-foreground` | `#ffffff` | 主按钮文字 |
| `--accent` | `#059669` | 终端绿，置顶/成功状态 |
| `--destructive` | `#dc2626` | 错误 |
| `--ring` | `#2563eb` | focus ring |

### 暗色主题（`.dark`）

| Token | 值 | 用途 |
|-------|-----|------|
| `--background` | `#0b0f14` | 主背景 |
| `--foreground` | `#e2e8f0` | 主文字 |
| `--card` | `#111827` | 卡片/面板背景 |
| `--muted` | `#1e293b` | muted 背景 |
| `--muted-foreground` | `#94a3b8` | 次级文字 |
| `--border` / `--input` | `#1e293b` | 边框/输入框 |
| `--primary` | `#60a5fa` | 主按钮/链接/高亮（暗色亮蓝） |
| `--primary-foreground` | `#0b1120` | 主按钮文字 |
| `--accent` | `#10b981` | 终端绿 |
| `--destructive` | `#f43f5e` | 错误 |
| `--ring` | `#60a5fa` | focus ring |

### 固定深色区域（双主题下均保持深色）

- **Hero 区**：博主配置的 `page_background` 背景图 + slate-950 渐变遮罩；未配置时回退蓝色网格渐变。文字固定白色，强调词 `text-blue-400`。
- **侧边栏「坚持写作」卡**：`bg-slate-900` + 白色文字。
- **代码块**：oneDark 主题，背景 `#0d1117`。
- 亮色下使用深色区域时需保证边框可见（如 `border-white/10`）。

## 字体

- **标题/正文**: Geist Sans, system-ui, sans-serif
- **代码/标签/终端元素**: Geist Mono, ui-monospace, monospace
- 正文字号 `16px`，行高 `1.75`；代码行高 `1.6`。

## 间距与布局

- 容器最大宽度：`max-w-7xl`（1280px）
- 全局内边距：`px-4 sm:px-6 lg:px-8`
- 首页：Hero（`py-16 md:py-24`）+ 两栏 `lg:grid-cols-[minmax(0,1fr)_340px]`
- 文章列表页/分类页网格：移动端 1 列，平板 2 列，桌面 3 列

## 圆角与阴影

- 卡片/按钮圆角：`rounded-lg`（8px）
- 标签圆角：`rounded-full`
- 阴影：悬停时 `shadow-md` + 边框 `primary/40`
- 悬停过渡：`transition-colors duration-200`（150–300ms）

## 组件风格

### 按钮

- 主按钮：bg-primary text-primary-foreground，hover:bg-primary/85
- 次按钮：border-border bg-transparent hover:border-primary/50 hover:text-primary
- Hero 上的按钮：主按钮同上；幽灵按钮 `border-white/30 text-white hover:bg-white/10`
- 所有按钮 `cursor-pointer`、`focus-visible:ring-2 focus-visible:ring-ring`

### 卡片

- 背景 `--card`，边框 `--border`
- hover：边框变为 `primary/40`，添加 `shadow-md`
- 内部分隔使用 subtle 边框

### 标签/徽章

- 分类徽章：`bg-primary/10 text-primary` 圆角胶囊
- 文章标签：bg-muted text-muted-foreground hover:text-primary
- 置顶徽章：`bg-accent/15 text-accent`

### 导航栏

- sticky + 毛玻璃 `bg-background/85 backdrop-blur`，高度 `h-16`
- 激活项：`text-primary` + 底部短横线
- 桌面端内嵌搜索框（回车跳 `/articles?keyword=`）、主题切换按钮、GitHub 链接（取自博主社交链接）

## 交互与无障碍

- 所有可点击元素 `cursor-pointer`
- focus 状态可见：`ring-2 ring-ring ring-offset-2 ring-offset-background`
- 表单元素必须有 label 或 aria-label
- 图片必须有 alt
- 支持 `prefers-reduced-motion`
- 触摸目标最小 44x44px（图标按钮 h-9/h-10）

## 反模式

- 不使用 emoji 作为图标（统一 Lucide React；品牌图标用 Simple Icons 内联 SVG）
- 不使用导致布局抖动的 hover transform（封面图缩放除外）
- 不使用超过 500ms 的动画
- 不使用与背景对比不足的灰色文字（亮色次级文字最低 `#475569`）
- 亮色模式下禁止使用低透明度深色卡片（`bg-white/10` 玻璃卡仅限深色区域）

## 响应式断点

- 375px: 移动优先，单列，汉堡菜单 + 折叠搜索
- 768px: 平板，双列，横向导航
- 1024px: 桌面，首页两栏（列表 + 340px 侧边栏）
- 1440px: 大屏，内容居中最大宽度
