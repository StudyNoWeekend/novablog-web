import { apiFetch } from "./client";
import type { ListResult, TravelGuide, TravelGuideDetail } from "@/lib/types";

export interface GetTravelsParams {
  page?: number;
  page_size?: number;
  keyword?: string;
  region?: string;
  category_id?: string;
  days_range?: string;
  sort?: string;
}

/** 旅行攻略列表 */
export async function getTravels(
  params: GetTravelsParams = {}
): Promise<ListResult<TravelGuide>> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.page_size) query.set("page_size", String(params.page_size));
  if (params.keyword) query.set("keyword", params.keyword);
  if (params.region) query.set("region", params.region);
  if (params.category_id) query.set("category_id", params.category_id);
  if (params.days_range && params.days_range !== "all")
    query.set("days_range", params.days_range);
  if (params.sort) query.set("sort", params.sort);

  const qs = query.toString();
  const path = qs ? `/public/travels?${qs}` : "/public/travels";

  try {
    return await apiFetch<ListResult<TravelGuide>>(path);
  } catch (error) {
    console.error("Failed to fetch travels:", error);
    // failed 标记供列表页区分「加载失败」与「暂无内容」
    return { list: [], total: 0, page: 1, page_size: 20, total_pages: 0, failed: true };
  }
}

/** 热门旅行攻略（详情页「更多攻略」） */
export async function getHotTravels(count = 5): Promise<TravelGuide[]> {
  try {
    return await apiFetch<TravelGuide[]>(`/public/travels/hot?count=${count}`);
  } catch (error) {
    console.error("Failed to fetch hot travels:", error);
    return [];
  }
}

/** 旅行攻略详情（含 attractions / itinerary / reviews JSONB 数组） */
export async function getTravelById(id: string): Promise<TravelGuideDetail | null> {
  try {
    return await apiFetch<TravelGuideDetail>(`/public/travels/${id}`);
  } catch (error) {
    console.error("Failed to fetch travel detail:", error);
    return null;
  }
}

/** 浏览计数 +1（fire-and-forget，失败静默） */
export async function incrementTravelView(id: string): Promise<void> {
  try {
    await apiFetch<null>(`/public/travels/${id}/view`);
  } catch (error) {
    console.error("Failed to increment travel view:", error);
  }
}

/** 点赞，成功返回 true（失败静默） */
export async function likeTravel(id: string): Promise<boolean> {
  try {
    await apiFetch<null>(`/public/travels/${id}/like`, { method: "POST" });
    return true;
  } catch (error) {
    console.error("Failed to like travel:", error);
    return false;
  }
}
