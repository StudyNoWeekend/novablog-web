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
  updated_at: string;
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

// ---------- 作品集（API） ----------
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

// ---------- 歌单 ----------
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

// ---------- 音乐 ----------
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

export interface AudioUrl {
  url: string;
}

// ---------- 设备 ----------
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
