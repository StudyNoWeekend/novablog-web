import { apiFetch } from "./client";
import type { Tag } from "@/lib/types";

export async function getTags(): Promise<Tag[]> {
  try {
    return await apiFetch<Tag[]>("/public/tags");
  } catch (error) {
    console.error("Failed to fetch tags:", error);
    return [];
  }
}
