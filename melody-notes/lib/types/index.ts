export interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
  trace_id?: string;
}

export class ApiError extends Error {
  constructor(
    public readonly code: number,
    public readonly msg: string,
    public readonly httpCode: number
  ) {
    super(msg);
    this.name = "ApiError";
  }
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

// ---------- 文章 ----------
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

// ---------- 分类与标签 ----------
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

// ---------- 歌曲 ----------
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

// ---------- 第三方歌单 ----------
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
