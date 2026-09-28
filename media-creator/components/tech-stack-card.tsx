import Image from "next/image";
import { Layers } from "lucide-react";
import type { TechStack } from "@/lib/api";
import { cn } from "@/lib/utils";

/** 熟练度映射：1=了解 2=熟悉 3=熟练 4=精通 */
export const TECH_LEVEL_META: Record<number, string> = {
  1: "了解",
  2: "熟悉",
  3: "熟练",
  4: "精通",
};

/** 技术栈卡片：图标 + 名称/分类 + 四档熟练度分段条 + 描述 */
export function TechStackCard({ stack }: { stack: TechStack }) {
  const level = Math.max(1, Math.min(4, stack.level || 1));
  const iconIsImage = /^(https?:\/\/|\/|data:)/i.test(String(stack.icon ?? ""));

  return (
    <article className="card-lift flex flex-col rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted">
          {stack.icon ? (
            iconIsImage ? (
              <Image
                src={stack.icon}
                alt={stack.name}
                width={24}
                height={24}
                className="h-6 w-6 object-contain"
                unoptimized
              />
            ) : (
              <span className="text-xl leading-none" aria-hidden="true">
                {stack.icon}
              </span>
            )
          ) : (
            <Layers className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          )}
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-foreground">{stack.name}</h3>
          {stack.category && (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{stack.category}</p>
          )}
        </div>
      </div>

      {stack.description && (
        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
          {stack.description}
        </p>
      )}

      {/* 熟练度：四段分段条 + 文字标签 */}
      <div className="mt-4 flex items-center gap-3">
        <span className="shrink-0 text-xs font-medium text-muted-foreground">
          {TECH_LEVEL_META[level] ?? `Lv.${level}`}
        </span>
        <div className="flex flex-1 gap-1" aria-label={`熟练度 ${level} / 4`}>
          {[1, 2, 3, 4].map((seg) => (
            <span
              key={seg}
              className={cn(
                "h-1.5 flex-1 rounded-full",
                seg <= level ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>
    </article>
  );
}
