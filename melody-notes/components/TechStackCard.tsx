"use client";

import { getFileUrl } from "@/lib/api/client";
import type { TechStack } from "@/lib/types";

interface TechStackCardProps {
  item: TechStack;
}

/** 熟练度 1-4 档文案 */
const LEVEL_LABELS: Record<number, string> = {
  1: "了解",
  2: "熟悉",
  3: "熟练",
  4: "精通",
};

/** 技术栈卡片（无详情页，仅展示） */
export function TechStackCard({ item }: TechStackCardProps) {
  const levelLabel = LEVEL_LABELS[item.level] || "";

  return (
    <article className="flex flex-col rounded-xl border border-border bg-surface p-5 shadow-card">
      {/* 图标 + 名称 + 分类 */}
      <div className="flex items-center gap-3">
        {item.icon && (
          // 图标为后端下发的图片 URL（getFileUrl 过滤非法协议），禁用 referrer 保证部分图床可访问
          <img
            src={getFileUrl(item.icon)}
            alt={item.name}
            className="h-10 w-10 shrink-0 rounded-lg object-contain"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        )}
        <div className="min-w-0">
          <h3 className="truncate text-[17px] font-bold leading-snug text-text-primary">
            {item.name}
          </h3>
          {item.category && (
            <p className="mt-0.5 truncate text-xs text-text-muted">{item.category}</p>
          )}
        </div>
      </div>

      {/* 熟练度：4 段进度条 + 档位文案 */}
      <div className="mt-4 flex items-center gap-2">
        <div className="flex flex-1 gap-1" role="img" aria-label={`熟练度：${levelLabel || item.level}`}>
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 flex-1 rounded-full ${
                i < item.level ? "bg-accent" : "bg-text-muted/15"
              }`}
            />
          ))}
        </div>
        {levelLabel && (
          <span className="shrink-0 text-xs font-medium text-accent">{levelLabel}</span>
        )}
      </div>

      {/* 描述 */}
      {item.description && (
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-text-muted">
          {item.description}
        </p>
      )}
    </article>
  );
}
