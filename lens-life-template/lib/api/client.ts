import { env } from "@/lib/config/env";
import { ApiError, type ApiResponse } from "./types";

function buildUrl(base: string, path: string): string {
  const normalizedBase = base.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const joined = `${normalizedBase}/api/v1${normalizedPath}`;
  return joined.replace(/([^:])\/+/g, "$1/");
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const url = buildUrl(env.API_BASE_URL, path);

  const headers = new Headers(init?.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), env.API_TIMEOUT);

  try {
    const res = await fetch(url, {
      ...init,
      headers,
      signal: controller.signal,
      cache: "no-store",
    });

    const response = (await res.json()) as ApiResponse<T>;

    if (response.code !== 0) {
      throw new ApiError(response.code, response.msg, res.status);
    }

    return response.data;
  } finally {
    clearTimeout(timeoutId);
  }
}
