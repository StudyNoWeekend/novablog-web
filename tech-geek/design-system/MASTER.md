# Tech Geek Blog 设计系统

> 面向开发者、开源爱好者与硬核技术读者的深色终端/代码风格博客。

## 设计定位

- **产品类型**: 技术博客 / 开发者个人站点
- **风格关键词**: dark terminal, code, minimalist, developer, engineering
- **情感**: 专业、冷静、精确、沉浸、极客
- **模式**: 深色为主，终端绿/青作为强调色， monospace 字体用于代码与标签

## 配色

### 主色

| Token | 值 | 用途 |
|-------|-----|------|
| `--background` | `#0b0f14` | 主背景 |
| `--foreground` | `#e2e8f0` | 主文字 |
| `--card` | `#111827` | 卡片/面板背景 |
| `--card-foreground` | `#e2e8f0` | 卡片文字 |
| `--muted` | `#1e293b` |  muted 背景 |
| `--muted-foreground` | `#94a3b8` | 次级文字 |
| `--border` | `#1e293b` | 边框 |
| `--input` | `#1e293b` | 输入框背景 |
| `--ring` | `#22d3ee` | focus ring |

### 强调色

| Token | 值 | 用途 |
|-------|-----|------|
| `--primary` | `#22d3ee` | 终端青，主按钮/链接/高亮 |
| `--primary-foreground` | `#0b0f14` | 主按钮文字 |
| `--accent` | `#10b981` | 终端绿，成功/标签/状态 |
| `--accent-foreground` | `#0b0f14` | 强调文字 |
| `--destructive` | `#f43f5e` | 错误 |

### 代码高亮

使用 `oneDark` 主题，背景 `#0d1117`，文字 `#c9d1d9`。

## 字体

- **标题/正文**: Geist Sans, system-ui, sans-serif
- **代码/标签/终端元素**: Geist Mono, ui-monospace, monospace
- 正文字号 `16px`，行高 `1.75`；代码行高 `1.6`。

## 间距与布局

- 容器最大宽度：`max-w-7xl`（1280px）
- 全局内边距：`px-4 sm:px-6 lg:px-8`
- 区块间距：`py-16 md:py-24`
- 卡片内边距：`p-5 md:p-6`
- 网格：移动端 1 列，平板 2 列，桌面 3 列

## 圆角与阴影

- 卡片圆角：`rounded-lg`（8px）
- 按钮圆角：`rounded-lg`
- 代码块圆角：`rounded-md`
- 阴影：极弱或仅使用边框/光晕，避免厚重阴影
- 悬停：边框颜色变化、primary 光晕、`transition-colors duration-200`

## 组件风格

### 按钮

- 主按钮：bg-primary text-primary-foreground，hover:bg-primary/80
- 次按钮：border-border bg-transparent hover:border-primary/50 hover:text-primary
- Ghost：hover:bg-muted
- 所有按钮 `cursor-pointer`、`focus-visible:ring-2 focus-visible:ring-ring`

### 卡片

- 背景 `--card`，边框 `--border`
- hover：边框变为 `primary/40`，添加 `shadow-[0_0_0_1px_var(--primary)]`
- 内部分隔使用 subtle 边框

### 标签/徽章

- 分类标签：border + monospace + 小字号
- 文章标签：bg-muted text-muted-foreground hover:text-primary

### 输入框

- bg-input border-border
- focus:border-primary focus:ring-2 focus:ring-ring

## 交互与无障碍

- 所有可点击元素 `cursor-pointer`
- focus 状态可见：`ring-2 ring-ring ring-offset-2 ring-offset-background`
- 表单元素必须有 label 或 aria-label
- 图片必须有 alt
- 支持 `prefers-reduced-motion`
- 触摸目标最小 44x44px

## 反模式

- 不使用 emoji 作为图标（统一 Lucide React）
- 不使用明亮渐变大背景
- 不使用超过 500ms 的动画
- 不使用导致布局抖动的 hover transform
- 不使用与背景对比不足的灰色文字

## 响应式断点

- 375px: 移动优先，单列
- 768px: 平板，双列
- 1024px: 桌面，三列
- 1440px: 大屏，内容居中最大宽度
