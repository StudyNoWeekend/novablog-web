import { apiFetch } from "./client";
import type { Equipment, Paginated } from "@/lib/types";

export interface GetEquipmentsParams {
  page?: number;
  page_size?: number;
  keyword?: string;
  brand?: string;
}

export async function getEquipments(
  params: GetEquipmentsParams = {}
): Promise<Paginated<Equipment>> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.page_size) query.set("page_size", String(params.page_size));
  if (params.keyword) query.set("keyword", params.keyword);
  if (params.brand) query.set("brand", params.brand);

  const qs = query.toString();
  const path = qs ? `/public/equipments?${qs}` : "/public/equipments";

  try {
    return await apiFetch<Paginated<Equipment>>(path);
  } catch (error) {
    console.error("Failed to fetch equipments:", error);
    return { list: [], total: 0, page: 1, page_size: 20, total_pages: 0 };
  }
}

export async function getEquipmentById(id: string): Promise<Equipment | null> {
  try {
    return await apiFetch<Equipment>(`/public/equipments/${id}`);
  } catch (error) {
    console.error("Failed to fetch equipment detail:", error);
    return null;
  }
}
