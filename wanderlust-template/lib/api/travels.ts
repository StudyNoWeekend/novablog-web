import { apiFetch } from "./client";
import type { Paginated, TravelGuide, TravelGuideDetail } from "@/lib/types";

export interface GetTravelsParams {
  page?: number;
  page_size?: number;
  keyword?: string;
  region?: string;
  category_id?: string;
  days_range?: string;
  sort?: string;
}

export async function getTravels(
  params: GetTravelsParams = {}
): Promise<Paginated<TravelGuide>> {
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
    return await apiFetch<Paginated<TravelGuide>>(path);
  } catch (error) {
    console.error("Failed to fetch travels:", error);
    return { list: [], total: 0, page: 1, page_size: 20, total_pages: 0 };
  }
}

export async function getHotTravels(count = 5): Promise<TravelGuide[]> {
  try {
    return await apiFetch<TravelGuide[]>(`/public/travels/hot?count=${count}`);
  } catch (error) {
    console.error("Failed to fetch hot travels:", error);
    return [];
  }
}

export async function getTravelById(id: string): Promise<TravelGuideDetail | null> {
  try {
    return await apiFetch<TravelGuideDetail>(`/public/travels/${id}`);
  } catch (error) {
    console.error("Failed to fetch travel detail:", error);
    return null;
  }
}

export async function incrementTravelView(id: string): Promise<void> {
  try {
    await apiFetch<null>(`/public/travels/${id}/view`);
  } catch (error) {
    console.error("Failed to increment travel view:", error);
  }
}

export async function likeTravel(id: string): Promise<boolean> {
  try {
    await apiFetch<null>(`/public/travels/${id}/like`, { method: "POST" });
    return true;
  } catch (error) {
    console.error("Failed to like travel:", error);
    return false;
  }
}
