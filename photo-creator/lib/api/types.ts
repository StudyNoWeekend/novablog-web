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
