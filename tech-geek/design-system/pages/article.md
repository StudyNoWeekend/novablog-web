# Article 页面设计覆盖

## 布局

- 文章详情采用单栏居中阅读流，最大宽度 `max-w-3xl`
- 顶部为封面图（全宽，最大高度 420px）
- 标题区下方为元信息行：分类、标签、发布时间、阅读量、评论数
- 正文区域与右侧/下方相关推荐分隔

## 排版

- 标题：text-3xl md:text-4xl font-bold tracking-tight
- 正文：prose prose-invert prose-lg，行高 1.75
- 代码块：rounded-md border border-border，背景 #0d1117
- 行内代码：bg-muted text-primary px-1.5 py-0.5 rounded font-mono

## 代码高亮

- 使用 `react-syntax-highlighter` + `oneDark`
- 显示语言标签
- 复制按钮悬停显示

## 元信息

- 使用 Lucide 图标：Calendar, Eye, MessageCircle, Folder, Tag
- 图标 + 文字组合，间距 gap-4

## 评论

- 评论区位于正文下方
- 评论表单位于列表上方
- 回复评论显示缩进层级
