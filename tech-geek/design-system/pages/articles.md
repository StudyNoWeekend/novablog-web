# Articles 列表页设计覆盖

## 布局

- 顶部为筛选栏：分类下拉/列表、搜索框
- 下方为文章卡片网格：1/2/3 列
- 底部分页组件

## 筛选栏

- 分类使用横向滚动标签列表，当前选中高亮 primary
- 搜索框占满移动端宽度，桌面限制 max-w-md
- 筛选变更时 URL query 同步

## 文章卡片

- 封面图 16:10，object-cover
- 标题：text-lg font-semibold line-clamp-2
- 摘要：text-sm text-muted-foreground line-clamp-2
- 底部元信息：分类、阅读量、评论数
- hover：边框高亮 + 标题变 primary

## 分页

- 上一页/下一页 + 页码
- 当前页 primary 背景
- 禁用状态 opacity-50 cursor-not-allowed
