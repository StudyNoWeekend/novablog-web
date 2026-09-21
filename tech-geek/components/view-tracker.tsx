"use client";

import { useEffect, useRef } from "react";
import { articles, travels } from "@/lib/api";

interface ViewTrackerProps {
  type: "article" | "travel";
  id: string;
}

/** 浏览计数客户端上报：静态导出后服务端 fire-and-forget 失效，挂载后上报一次 */
export function ViewTracker({ type, id }: ViewTrackerProps) {
  const reported = useRef(false);

  useEffect(() => {
    if (reported.current) return;
    reported.current = true;
    if (type === "article") {
      articles.view(id).catch(() => null);
    } else {
      travels.view(id).catch(() => null);
    }
  }, [type, id]);

  return null;
}
