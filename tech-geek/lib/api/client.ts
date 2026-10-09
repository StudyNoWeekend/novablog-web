import {
  ApiParams,
  ApiResponse,
  Article,
  ArticleDetail,
  AudioUrl,
  Blogger,
  Book,
  BookDetail,
  Category,
  Comment,
  CreateCommentPayload,
  Equipment,
  FitnessRecord,
  Game,
  GameDetail,
  ModuleConfig,
  OpenSource,
  OpenSourceDetail,
  PaginatedResponse,
  PaginationParams,
  Portfolio,
  PortfolioDetail,
  Recipe,
  RecipeDetail,
  Song,
  Tag,
  TechStack,
  TravelGuide,
  TravelGuideDetail,
  Video,
} from "./types";

declare global {
  interface Window {
    __NOVA_CONFIG__?: { apiBase?: string };
  }
}

/** 请求超时（ms），可由环境变量覆盖，默认 15s */
const API_TIMEOUT = Number(process.env.NEXT_PUBLIC_API_TIMEOUT ?? "") || 15_000;

/**
 * 站点根地址解析：theme-config.js 注入（可携带 /api/v1 前缀）> 编译期环境变量 > 同域相对路径。
 * 地图嵌入等 CMS 根路径页面复用此函数拼接地址。
 */
export function getBaseUrl(): string {
  // 优先级：部署时注入的 theme-config.js > 编译期环境变量 > 同域相对路径
  const injected =
    typeof window !== "undefined" && window.__NOVA_CONFIG__?.apiBase;
  if (injected) {
    // apiBase 允许携带 /api/v1 前缀（见主题规范 3.3），这里归一化为站点根地址
    return injected.replace(/\/api\/v1\/?$/, "").replace(/\/$/, "");
  }
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (base) {
    // 与注入分支一致：允许携带 /api/v1 前缀，归一化为站点根地址
    return base.replace(/\/api\/v1\/?$/, "").replace(/\/$/, "");
  }
  // 同域部署（CMS 统一托管）时直接走相对路径
  return "";
}

function friendlyError(status: number, message: string): string {
  switch (status) {
    case 400:
      return `请求参数错误：${message}`;
    case 403:
      return `访问受限：${message}`;
    case 404:
      return `资源不存在：${message}`;
    case 429:
      return `操作过于频繁，请稍后再试：${message}`;
    case 500:
      return `服务器内部错误：${message}`;
    default:
      return `请求失败 (${status})：${message}`;
  }
}

async function request<T>(
  method: "GET" | "POST",
  path: string,
  params?: ApiParams,
  options?: RequestInit
): Promise<T> {
  const baseUrl = getBaseUrl();
  let url = `${baseUrl}${path}`;

  if (method === "GET" && params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      searchParams.append(key, String(value));
    });
    const query = searchParams.toString();
    if (query) url += `?${query}`;
  }

  const fetchOptions: RequestInit = {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    // 默认超时，避免构建期/运行期请求无限挂起（可由调用方传入 signal 覆盖）
    signal: AbortSignal.timeout(API_TIMEOUT),
    ...options,
  };

  if (method === "POST" && params) {
    fetchOptions.body = JSON.stringify(params);
  }

  let response: Response;
  try {
    response = await fetch(url, fetchOptions);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`网络请求失败：${message}`);
  }

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    const message = text || response.statusText || "未知错误";
    throw new Error(friendlyError(response.status, message));
  }

  const result = (await response.json()) as ApiResponse<T>;

  if (result.code !== 0) {
    throw new Error(result.msg || `业务错误 (code: ${result.code})`);
  }

  return result.data as T;
}

export function get<T>(
  path: string,
  params?: ApiParams,
  options?: RequestInit
): Promise<T> {
  return request<T>("GET", path, params, options);
}

export function post<T>(
  path: string,
  params?: ApiParams,
  options?: RequestInit
): Promise<T> {
  return request<T>("POST", path, params, options);
}

export const blogger = {
  get: () => get<Blogger>("/api/v1/public/blogger"),
};

export const articles = {
  list: (params?: PaginationParams & { category_id?: string; keyword?: string }) =>
    get<PaginatedResponse<Article>>("/api/v1/public/articles", params),
  hot: (count?: number) =>
    get<Article[]>("/api/v1/public/articles/hot", count !== undefined ? { count } : undefined),
  random: (count?: number) =>
    get<Article[]>("/api/v1/public/articles/random", count !== undefined ? { count } : undefined),
  detail: (slug: string) =>
    get<ArticleDetail>(`/api/v1/public/articles/${slug}`),
  view: (slug: string) =>
    post<null>(`/api/v1/public/articles/${slug}/view`),
};

export const categories = {
  list: () => get<Category[]>("/api/v1/public/categories"),
};

export const tags = {
  list: () => get<Tag[]>("/api/v1/public/tags"),
};

export const comments = {
  list: (params?: PaginationParams & { target_type?: string; target_id?: string }) =>
    get<PaginatedResponse<Comment>>("/api/v1/public/comments", params),
  create: (payload: CreateCommentPayload) =>
    post<Comment>("/api/v1/public/comments", payload),
};

export const travels = {
  list: (
    params?: PaginationParams & {
      keyword?: string;
      region?: string;
      category_id?: string;
      days_range?: string;
      sort?: string;
    }
  ) => get<PaginatedResponse<TravelGuide>>("/api/v1/public/travels", params),
  hot: (count?: number) =>
    get<TravelGuide[]>("/api/v1/public/travels/hot", count !== undefined ? { count } : undefined),
  detail: (id: string) => get<TravelGuideDetail>(`/api/v1/public/travels/${id}`),
  view: (id: string) => post<null>(`/api/v1/public/travels/${id}/view`),
  like: (id: string) => post<null>(`/api/v1/public/travels/${id}/like`),
};

export const portfolios = {
  list: (params?: PaginationParams & { keyword?: string; category_id?: string }) =>
    get<PaginatedResponse<Portfolio>>("/api/v1/public/portfolios", params),
  detail: (id: string) => get<PortfolioDetail>(`/api/v1/public/portfolios/${id}`),
};

export const videos = {
  list: (params?: PaginationParams & { keyword?: string }) =>
    get<PaginatedResponse<Video>>("/api/v1/public/videos", params),
  detail: (id: string) => get<Video>(`/api/v1/public/videos/${id}`),
};

export const music = {
  list: (params?: PaginationParams & { category_id?: string }) =>
    get<PaginatedResponse<Song>>("/api/v1/public/music/songs", params),
  detail: (id: string) => get<Song>(`/api/v1/public/music/songs/${id}`),
  // 返回 B 站官方外链播放器地址，需用 <iframe> 内嵌播放（不支持音频直链）
  playerUrl: (songId: string) =>
    get<AudioUrl>(`/api/v1/public/music/audio-url/${songId}`),
};

export const equipments = {
  list: (params?: PaginationParams & { keyword?: string; brand?: string }) =>
    get<PaginatedResponse<Equipment>>("/api/v1/public/equipments", params),
  detail: (id: string) => get<Equipment>(`/api/v1/public/equipments/${id}`),
};

export const openSources = {
  list: (params?: PaginationParams & { keyword?: string }) =>
    get<PaginatedResponse<OpenSource>>("/api/v1/public/open-sources", params),
  detail: (id: string) => get<OpenSourceDetail>(`/api/v1/public/open-sources/${id}`),
};

export const recipes = {
  list: (params?: PaginationParams & { keyword?: string; difficulty?: number }) =>
    get<PaginatedResponse<Recipe>>("/api/v1/public/recipes", params),
  detail: (id: string) => get<RecipeDetail>(`/api/v1/public/recipes/${id}`),
};

export const books = {
  list: (params?: PaginationParams & { keyword?: string; reading_status?: string }) =>
    get<PaginatedResponse<Book>>("/api/v1/public/books", params),
  detail: (id: string) => get<BookDetail>(`/api/v1/public/books/${id}`),
};

export const games = {
  list: (params?: PaginationParams & {
    keyword?: string;
    platform?: string;
    genre?: string;
    play_status?: string;
  }) => get<PaginatedResponse<Game>>("/api/v1/public/games", params),
  detail: (id: string) => get<GameDetail>(`/api/v1/public/games/${id}`),
};

export const fitness = {
  // 健身训练仅列表接口（无详情）
  list: (params?: PaginationParams & { keyword?: string; type?: string }) =>
    get<PaginatedResponse<FitnessRecord>>("/api/v1/public/fitness", params),
};

export const techStacks = {
  // 技术栈仅列表接口（无详情）
  list: (params?: PaginationParams & { keyword?: string; category?: string; level?: number }) =>
    get<PaginatedResponse<TechStack>>("/api/v1/public/tech-stacks", params),
};

/**
 * 将后端返回的文件路径解析为可访问 URL：
 * 完整 URL（http/https）、站点绝对路径、data: 直接返回；相对路径拼「站点根 /files/」前缀
 */
export function resolveFileUrl(path?: string | null): string {
  const value = String(path ?? "").trim();
  if (!value) return "";
  if (/^(https?:\/\/|\/|#|data:)/i.test(value)) return value;
  return `${getBaseUrl()}/files/${value.replace(/^\.\//, "")}`;
}

export const ALL_ENABLED_MODULE_CONFIG: ModuleConfig = {
  article_enabled: true,
  media_enabled: true,
  music_enabled: true,
  video_enabled: true,
  travel_enabled: true,
  portfolio_enabled: true,
  equipment_enabled: true,
  open_source_enabled: true,
  recipe_enabled: true,
  book_enabled: true,
  game_enabled: true,
  fitness_enabled: true,
  tech_stack_enabled: true,
};

/**
 * 模块开关配置。失败时回退为全部开启，保证页面可用；
 * 服务端（layout 构建期）与客户端（导航运行时重取、页面门禁）均可安全调用。
 */
export async function getModuleConfig(): Promise<ModuleConfig> {
  try {
    const config = await get<ModuleConfig>("/api/v1/public/module-config");
    return { ...ALL_ENABLED_MODULE_CONFIG, ...config };
  } catch (error) {
    console.error("Failed to fetch module config:", error);
    return ALL_ENABLED_MODULE_CONFIG;
  }
}
