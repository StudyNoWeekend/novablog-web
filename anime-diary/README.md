# 次元日记（anime-diary）

面向二次元博主的粉紫梦幻动漫风博客主题：动漫推荐、游戏心得、插画作品、音乐分享与生活日常。

## 设计语言

- **深夜紫 + 薰衣草奶白 + 樱花粉**：深夜紫（`#2f2847`）用于导航 / Hero / 页脚的沉浸式框架，内容区为薰衣草奶白，樱花粉（`#f078a1`）作为主强调色，辅以薰衣草紫 / 天空蓝 / 薄荷绿马卡龙色系；
- **站酷快乐体**（ZCOOL KuaiLe）作为展示字体，圆润可爱贴合二次元气质；
- 漂浮星星 / 爱心装饰、波浪过渡、分类徽章按分类 id 在粉/紫/蓝/绿间循环取色。

## 页面

| 路由 | 说明 | 模块开关 |
|---|---|---|
| `/` | Hero（博主页面背景 + 标语 + CTA）、博主名片、分类入口、最新动态 + 侧栏（博主小卡 / 热门标签 / 关注横幅） | — |
| `/articles` | 动态列表：分类筛选 + 关键词搜索 + 热门动态 / 标签云侧栏 + 分页 | `article_enabled` |
| `/articles/[slug]` | 动态详情：构建期预渲染 + `public/article.html` 壳页面兜底，含评论与浏览上报 | `article_enabled` |
| `/music` | 歌曲列表 + 第三方歌单，点击歌曲唤起底部播放条 | `music_enabled` |
| `/portfolio` | 插画作品封面墙，弹层浏览 + 大图灯箱（键盘 ←/→/Esc） | `portfolio_enabled` |
| `/open-source`、`/open-source/[id]` | 开源作品列表与详情，渲染 Markdown README、仓库与主页外链 | `open_source_enabled` |
| `/recipes`、`/recipes/[id]` | 美食菜谱列表与详情，含难度筛选、食材清单与编号步骤图 | `recipe_enabled` |
| `/books`、`/books/[id]` | 读书书架列表与详情，含阅读状态筛选、星级与 Markdown 书评 | `book_enabled` |
| `/games`、`/games/[id]` | 游戏库列表与详情，含游玩状态筛选、评分（x/10）与短评 | `game_enabled` |
| `/fitness` | 健身训练记录列表，含训练类型筛选（仅列表页） | `fitness_enabled` |
| `/tech-stack` | 技术栈列表，含熟练度筛选与 4 档进度展示（仅列表页） | `tech_stack_enabled` |
| `/about` `/contact` | 关于我 / 联系方式 | — |
| 404 | 「呜喵，页面走丢了」猫爪 404 页 | — |

六个新模块入口统一收纳在导航「更多」下拉（移动端「更多功能」小节）与页脚链接中，随模块开关过滤；模块关闭时对应页面显示「模块未开启」提示。

## 音乐播放器

与全仓库主题统一的**底部播放条**方案（参考 `lens-life-template`）：

- 音源为 B 站官方外链播放器，隐藏 iframe 作为纯音频引擎（1px 透明，不展示视频画面）；
- 跨域 iframe 无法监听媒体事件，播放/暂停通过重载 iframe（`autoplay=0/1` + `t` 定位）实现，
  进度按歌曲时长前端估算（墙钟计时，后台标签页节流后自动追平），支持拖拽 seek；
- 播放模式循环切换：顺序 → 随机 → 单曲；到时长后按模式自动切歌；播放地址获取失败可重试。

## 主题规范

构建、API 地址解析、壳页面、打包与发布规则见仓库根 [docs/theme-spec.md](../docs/theme-spec.md)。
页脚含主题来源链接（`theme.json.homepage`）与版本徽章。

## 本地开发

```bash
pnpm install
pnpm dev   # 需要后端时配置 .env.local（参考 .env.local.example）
```
