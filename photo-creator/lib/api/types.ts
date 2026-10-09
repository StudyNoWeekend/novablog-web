export interface ApiResponse<T> {
  code: number;
  msg: string;
  data?: T;
  trace_id?: string;
}

export interface PaginatedResponse<T> {
  list: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ApiParams {
  [key: string]: string | number | boolean | undefined | null;
}

export interface PaginationParams extends ApiParams {
  page?: number;
  page_size?: number;
}

/** 博主星座（GET /api/v1/public/blogger，未设置或博主关闭展示时为 null） */
export interface ZodiacInfo {
  key: string;
  name: string;
  image: string;
  date_range: string;
  element: string;
}

/** 博主性格 MBTI（GET /api/v1/public/blogger，未设置或博主关闭展示时为 null） */
export interface PersonalityInfo {
  key: string;
  name: string;
  image: string;
  description: string;
}

export interface Blogger {
  nickname: string;
  avatar: string;
  bio: string;
  blog_title: string;
  blog_description: string;
  page_background: string;
  blog_icon: string;
  social_links: {
    platform: string;
    url: string;
    sort_order: number;
  }[];
  /** 星座信息，未设置或博主关闭展示时为 null */
  zodiac?: ZodiacInfo | null;
  /** 性格（MBTI）信息，未设置或博主关闭展示时为 null */
  personality?: PersonalityInfo | null;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  cover_image: string;
  category_id: string;
  category_name: string;
  tag_ids: string[];
  tag_names: string[];
  status: number;
  type: number;
  view_count: number;
  comment_count: number;
  is_top: boolean;
  is_comment: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ArticleDetail extends Article {
  content: string;
  extra?: Record<string, unknown>;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: string;
  sort_order: number;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
  created_at: string;
}

export interface Comment {
  id: string;
  target_type: string;
  target_id: string;
  parent_id?: string;
  nickname: string;
  website?: string;
  content: string;
  is_blogger: boolean;
  created_at: string;
}

export interface CreateCommentPayload extends ApiParams {
  target_type: string;
  target_id: string;
  parent_id?: string;
  nickname: string;
  website?: string;
  content: string;
}

export interface TravelGuide {
  id: string;
  title: string;
  summary: string;
  cover_image: string;
  status: number;
  destination: string;
  region: string;
  category_id: string;
  category_name: string;
  days: number;
  best_month: string;
  view_count: number;
  like_count: number;
  rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
}

export interface TravelGuideDetail extends TravelGuide {
  attractions: Record<string, unknown>[];
  itinerary: Record<string, unknown>[];
  reviews: Record<string, unknown>[];
}

export interface Portfolio {
  id: string;
  name: string;
  description: string;
  cover_mode: number;
  cover_preset_id: string;
  cover_url: string;
  status: number;
  sort_order: number;
  category_id: string;
  category_name: string;
  item_count: number;
  created_at: string;
  updated_at: string;
}

export interface PortfolioItem {
  id: string;
  portfolio_id: string;
  preset_id: string;
  title: string;
  description: string;
  sort_order: number;
  output_url: string;
  mime_type: string;
  output_size: number;
  created_at: string;
  updated_at: string;
}

export interface PortfolioDetail extends Portfolio {
  items: PortfolioItem[];
}

export interface VideoPlatform {
  id: string;
  video_id: string;
  platform: string;
  url: string;
  created_at: string;
  updated_at: string;
}

export interface Video {
  id: string;
  title: string;
  cover_url: string;
  description: string;
  status: number;
  sort_order: number;
  platforms: VideoPlatform[];
  created_at: string;
  updated_at: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  cover_url: string;
  bvid: string;
  cid: number;
  source_url: string;
  source_type: string;
  category_id?: string;
  duration: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

/** B 站官方外链播放器地址（iframe 内嵌播放用，非音频直链） */
export interface AudioUrl {
  url: string;
}

/** 模块开关配置（GET /api/v1/public/module-config），关闭的模块隐藏导航项并渲染「模块未开启」提示 */
export interface ModuleConfig {
  article_enabled: boolean;
  media_enabled: boolean;
  music_enabled: boolean;
  video_enabled: boolean;
  travel_enabled: boolean;
  portfolio_enabled: boolean;
  equipment_enabled: boolean;
  /** 开源作品模块开关 */
  open_source_enabled: boolean;
  /** 美食菜谱模块开关 */
  recipe_enabled: boolean;
  /** 读书书架模块开关 */
  book_enabled: boolean;
  /** 游戏库模块开关 */
  game_enabled: boolean;
  /** 健身训练模块开关 */
  fitness_enabled: boolean;
  /** 技术栈模块开关 */
  tech_stack_enabled: boolean;
  updated_at?: string;
}

/** 开源作品（GET /open-sources） */
export interface OpenSource {
  id: string;
  name: string;
  repo_url: string;
  summary: string;
  language: string;
  /** 逗号分隔的话题标签，如 "go,cli,tools" */
  topics: string;
  stars: number;
  homepage: string;
  status: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface OpenSourceDetail extends OpenSource {
  /** README 原文（Markdown） */
  readme: string;
  readme_updated_at?: string;
}

/** 美食菜谱（GET /recipes） */
export interface Recipe {
  id: string;
  title: string;
  cover: string;
  summary: string;
  /** 难度：1=简单 2=中等 3=困难 */
  difficulty: number;
  /** 烹饪耗时（分钟） */
  minutes: number;
  servings: number;
  /** 逗号分隔的标签 */
  tags: string;
  status: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface RecipeDetail extends Recipe {
  ingredients: { name: string; amount: string }[];
  /** image 为相对路径时需拼「站点根 /files/」前缀展示 */
  steps: { text: string; image: string }[];
}

/** 读书书架（GET /books） */
export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  /** 评分 0-5 星 */
  rating: number;
  /** 阅读状态：want=想读 reading=在读 done=读完 */
  reading_status: string;
  status: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface BookDetail extends Book {
  /** 书评（Markdown） */
  review: string;
  started_at?: string;
  finished_at?: string;
}

/** 游戏库（GET /games） */
export interface Game {
  id: string;
  title: string;
  cover: string;
  platform: string;
  genre: string;
  /** 游玩状态：want=想玩 playing=在玩 played=玩过 */
  play_status: string;
  /** 累计游玩时长（小时） */
  play_hours: number;
  /** 评分 0-10 */
  rating: number;
  status: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface GameDetail extends Game {
  /** 简评（Markdown） */
  short_review: string;
}

/** 健身训练记录（GET /fitness，仅列表无详情） */
export interface FitnessRecord {
  id: string;
  /** 训练日期，如 "2026-09-28" */
  date: string;
  title: string;
  /** 训练类型：strength=力量 cardio=有氧 stretch=拉伸 */
  type: string;
  /** 时长（分钟） */
  duration_min: number;
  /** 消耗（千卡） */
  calories: number;
  status: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

/** 技术栈（GET /tech-stacks，仅列表无详情） */
export interface TechStack {
  id: string;
  name: string;
  category: string;
  icon: string;
  /** 熟练度：1=了解 2=熟悉 3=熟练 4=精通 */
  level: number;
  description: string;
  status: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}
