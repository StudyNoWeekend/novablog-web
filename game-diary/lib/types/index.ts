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
  published_at: string | null;
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

export interface Paginated<T> {
  list: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// ---------- 模块开关配置 ----------
export interface ModuleConfig {
  article_enabled: boolean;
  media_enabled: boolean;
  music_enabled: boolean;
  video_enabled: boolean;
  travel_enabled: boolean;
  portfolio_enabled: boolean;
  equipment_enabled: boolean;
  open_source_enabled: boolean;
  recipe_enabled: boolean;
  book_enabled: boolean;
  game_enabled: boolean;
  fitness_enabled: boolean;
  tech_stack_enabled: boolean;
  updated_at: string;
}

// 带失败标记的分页结果：failed=true 表示请求失败（list 回退为空数组），
// 列表页据此展示「错误重试」态，与「暂无内容」空态区分
export interface ListResult<T> extends Paginated<T> {
  failed?: boolean;
}

// ---------- 标签 ----------
export interface Tag {
  id: string;
  name: string;
  created_at: string;
}

// ---------- 评论 ----------
export interface Comment {
  id: string;
  target_type: string;
  target_id: string;
  parent_id?: string | null;
  nickname: string;
  website?: string;
  content: string;
  is_blogger: boolean;
  created_at: string;
}

export interface CreateCommentPayload {
  target_type: string;
  target_id: string;
  parent_id?: string;
  nickname: string;
  website?: string;
  content: string;
}

// ---------- 视频 ----------
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

// ---------- 游戏库 ----------
export type GamePlayStatus = "want" | "playing" | "played";

export interface Game {
  id: string;
  title: string;
  cover: string;
  platform: string;
  genre: string;
  play_status: GamePlayStatus;
  play_hours: number; // 游玩时长（小时）
  rating: number; // 0-10 分
  status: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface GameDetail extends Game {
  short_review: string;
}

// ---------- 开源作品 ----------
export interface OpenSource {
  id: string;
  name: string;
  repo_url: string;
  summary: string;
  language: string;
  topics: string; // 逗号分隔的主题标签字符串
  stars: number;
  homepage: string;
  status: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface OpenSourceDetail extends OpenSource {
  readme: string; // Markdown 原文
  readme_updated_at: string;
}

// ---------- 美食菜谱 ----------
export interface Recipe {
  id: string;
  title: string;
  cover: string;
  summary: string;
  difficulty: number; // 1=简单 2=中等 3=困难
  minutes: number; // 耗时（分钟）
  servings: number; // 份量
  tags: string; // 逗号分隔的标签字符串
  status: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface RecipeIngredient {
  name: string;
  amount: string;
}

export interface RecipeStep {
  text: string;
  image: string; // 相对路径；展示前需拼接 API 站点根 + /files/（见 client.ts getFileUrl）
}

export interface RecipeDetail extends Recipe {
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
}

// ---------- 读书书架 ----------
export type ReadingStatus = "want" | "reading" | "done";

export interface Book {
  id: string;
  title: string;
  author: string;
  cover: string;
  rating: number; // 0-5 星
  reading_status: ReadingStatus;
  status: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface BookDetail extends Book {
  review: string; // Markdown 书评
  started_at: string | null;
  finished_at: string | null;
}

// ---------- 健身训练 ----------
export type FitnessType = "strength" | "cardio" | "stretch";

export interface FitnessRecord {
  id: string;
  date: string;
  title: string;
  type: FitnessType;
  duration_min: number; // 时长（分钟）
  calories: number; // 千卡
  status: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// ---------- 技术栈 ----------
export interface TechStack {
  id: string;
  name: string;
  category: string;
  icon: string;
  level: number; // 1=了解 2=熟悉 3=熟练 4=精通
  description: string;
  status: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// ---------- 音乐 ----------
export interface Playlist {
  id: string;
  title: string;
  cover_url: string;
  platform: string;
  platform_url: string;
  description: string;
  sort_order: number;
  enabled: boolean;
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
  category_id?: string | null;
  duration: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

/** B 站官方外链播放器地址（iframe 内嵌播放用，非音频直链） */
export interface AudioUrl {
  url: string;
}

// ---------- 旅行攻略 ----------
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

// ---------- 装备 ----------
export interface Equipment {
  id: string;
  name: string;
  image_url: string;
  brand: string;
  description: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// ---------- 摄影作品集 ----------
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
