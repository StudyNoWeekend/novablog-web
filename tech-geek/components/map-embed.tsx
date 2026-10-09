"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { getBaseUrl } from "@/lib/api/client";

// 与 CMS 地图嵌入页约定的 postMessage 高度协议（novablog-旅行攻略地图展示方案）
const MAP_EMBED_HEIGHT_MESSAGE = "novablog-map-embed:height";
const MIN_HEIGHT = 240;
const MAX_HEIGHT = 2000;

function clampHeight(height: number): number {
  return Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, Math.round(height)));
}

// 站点根仅在浏览器可用（theme-config.js 注入）；SSR 水合期返回空串保持一致。
// 经 useSyncExternalStore 读取，避免在 effect 里同步 setState 触发 React Compiler 规则
const subscribeSiteRoot = () => () => {};
const getSiteRootSnapshot = () => getBaseUrl();
const getSiteRootServerSnapshot = () => "";

interface MapEmbedProps {
  travelId: string;
  heightHint?: number;
  className?: string;
}

/**
 * 攻略景点地图嵌入（CMS 根路径 /map-embed/travel/:id，Leaflet + OSM 免 key 底图）。
 * 监听嵌入页 postMessage 自适应高度。
 */
export function MapEmbed({
  travelId,
  heightHint = 420,
  className = "",
}: MapEmbedProps) {
  const siteRoot = useSyncExternalStore(
    subscribeSiteRoot,
    getSiteRootSnapshot,
    getSiteRootServerSnapshot
  );
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(() => clampHeight(heightHint));

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      const data = event.data as Record<string, unknown> | null;
      if (
        event.source !== frameRef.current?.contentWindow ||
        !data ||
        typeof data !== "object" ||
        data.type !== MAP_EMBED_HEIGHT_MESSAGE ||
        typeof data.height !== "number"
      ) {
        return;
      }
      setHeight(clampHeight(data.height));
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const src = `${siteRoot}/map-embed/travel/${encodeURIComponent(travelId)}?h=${clampHeight(heightHint)}`;

  return (
    <iframe
      ref={frameRef}
      src={src}
      title="景点地图"
      loading="lazy"
      className={`w-full rounded-lg border-0 ${className}`}
      style={{ height }}
    />
  );
}
