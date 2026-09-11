import { apiFetch } from "./client";
import type { Paginated, Portfolio, PortfolioDetail } from "@/lib/types";

export interface GetPortfoliosParams {
  page?: number;
  page_size?: number;
  keyword?: string;
  category_id?: string;
}

export async function getPortfolios(
  params: GetPortfoliosParams = {}
): Promise<Paginated<Portfolio>> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.page_size) query.set("page_size", String(params.page_size));
  if (params.keyword) query.set("keyword", params.keyword);
  if (params.category_id) query.set("category_id", params.category_id);

  const qs = query.toString();
  const path = qs ? `/public/portfolios?${qs}` : "/public/portfolios";

  try {
    return await apiFetch<Paginated<Portfolio>>(path);
  } catch (error) {
    console.error("Failed to fetch portfolios:", error);
    return { list: [], total: 0, page: 1, page_size: 20, total_pages: 0 };
  }
}

export async function getPortfolioDetail(id: string): Promise<PortfolioDetail | null> {
  try {
    return await apiFetch<PortfolioDetail>(`/public/portfolios/${id}`);
  } catch (error) {
    console.error("Failed to fetch portfolio detail:", error);
    return null;
  }
}
