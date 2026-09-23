import { env } from "@/lib/config/env";
import { ApiError, type ApiResponse } from "@/lib/types";

declare global {
  interface Window {
    __NOVA_CONFIG__?: { apiBase?: string };
  }
}

/**
 * API 站点根地址解析（主题规范 3.2）：
 * ① 部署端注入的 theme-config.js（window.__NOVA_CONFIG__.apiBase）
 * ② 编译期环境变量 NEXT_PUBLIC_API_BASE_URL
 * ③ 同域相对路径（CMS 统一托管时的默认值）
 * ①② 允许携带 /api/v1 前缀，统一归一化为站点根。
 */
function getSiteRoot(): string {
  const injected =
    typeof window !== "undefined" && window.__NOVA_CONFIG__?.apiBase;
  if (injected) {
    return injected.replace(/\/api\/v1\/?$/, "").replace(/\/$/, "");
  }
  if (env.API_BASE_URL) {
    return env.API_BASE_URL.replace(/\/api\/v1\/?$/, "").replace(/\/$/, "");
  }
  return "";
}

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
  const url = buildUrl(getSiteRoot(), path);

  const headers = new Headers(init?.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  // 统一超时兜底，避免构建期/运行期请求无限挂起
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), env.API_TIMEOUT);

  try {
    const res = await fetch(url, {
      ...init,
      headers,
      signal: controller.signal,
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
