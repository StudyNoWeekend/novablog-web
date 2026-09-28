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
    <article className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40 focus-within:ring-2 focus-within:ring-ring">
      <div className="flex items-center gap-3.5">
        <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
          {stack.icon ? (
            iconIsImage ? (
              <Image
                src={stack.icon}
                alt={stack.name}
                width={22}
                height={22}
                className="size-5.5 object-contain"
                unoptimized
              />
            ) : (
              <span className="text-lg leading-none" aria-hidden="true">
                {stack.icon}
              </span>
            )
          ) : (
            <Layers className="size-5 text-muted-foreground" aria-hidden="true" />
          )}
        </div>
        <div className="min-w-0">
          <h3 className="truncate font-heading text-lg font-medium text-foreground">
            {stack.name}
          </h3>
          {stack.category && (
            <p className="mt-0.5 truncate text-xs tracking-wide text-muted-foreground">
              {stack.category}
            </p>
          )}
        </div>
      </div>

      {stack.description && (
        <p className="mt-4 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
          {stack.description}
        </p>
      )}

      {/* 熟练度：四段分段条 + 文字标签 */}
      <div className="mt-5 flex items-center gap-3">
        <span className="shrink-0 text-xs text-muted-foreground">
          {TECH_LEVEL_META[level] ?? `Lv.${level}`}
        </span>
        <div className="flex flex-1 gap-1" aria-label={`熟练度 ${level} / 4`}>
          {[1, 2, 3, 4].map((seg) => (
            <span
              key={seg}
              className={cn(
                "h-1 flex-1 rounded-full",
                seg <= level ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>
    </article>
  );
}
