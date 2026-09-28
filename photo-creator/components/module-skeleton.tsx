interface ModuleRowSkeletonProps {
  /** 骨架行数，默认 5 */
  count?: number;
  /** 首列是否为封面块（读书书架为竖版封面，健身训练为图标块） */
  variant?: "cover" | "icon";
}

/** 横条列表加载骨架：与读书书架/健身训练的行卡片同构的占位动画 */
export function ModuleRowSkeleton({ count = 5, variant = "cover" }: ModuleRowSkeletonProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-4 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={`module-row-skeleton-${i}`}
          className="flex items-center gap-5 rounded-xl border border-border bg-card p-5"
        >
          {variant === "cover" ? (
            <div className="aspect-[3/4] w-20 shrink-0 rounded-lg bg-muted sm:w-24" />
          ) : (
            <div className="size-12 shrink-0 rounded-full bg-muted" />
          )}
          <div className="flex-1 space-y-3">
            <div className="h-4 w-1/3 rounded bg-muted" />
            <div className="h-3 w-1/4 rounded bg-muted" />
          </div>
          <div className="h-4 w-16 rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}
