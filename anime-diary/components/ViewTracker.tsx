"use client";

import { useEffect, useRef } from "react";
import { incrementArticleView } from "@/lib/api/articles";

/**
 * 浏览计数客户端上报：静态导出后详情页在构建期渲染，
 * 服务端 fire-and-forget 计数失效，改由浏览器端在挂载后上报一次。
 */
export function ArticleViewTracker({ slug }: { slug: string }) {
  const reported = useRef(false);

  useEffect(() => {
    if (reported.current) return;
    reported.current = true;
    incrementArticleView(slug);
  }, [slug]);

  return null;
}
