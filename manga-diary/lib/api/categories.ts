import { apiFetch } from "./client";
import type { Category } from "@/lib/types";

export async function getCategories(): Promise<Category[]> {
  try {
    return await apiFetch<Category[]>("/public/categories");
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}
