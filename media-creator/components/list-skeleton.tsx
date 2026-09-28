interface ListSkeletonProps {
  /** 骨架卡片数量 */
  count?: number;
  /** 布局变体：grid=封面卡网格，row=横条列表（书籍/健身） */
  variant?: "grid" | "row";
}

/** 列表页加载骨架：与卡片网格同构的占位动画（与主题现有骨架一致的 animate-pulse 圆角块） */
export function ListSkeleton({ count = 8, variant = "grid" }: ListSkeletonProps) {
  if (variant === "row") {
    return (
      <div className="mt-8 space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={`row-skeleton-${i}`}
            className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4"
          >
            <div className="h-12 w-12 shrink-0 animate-pulse rounded-xl bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
              <div className="h-3 w-1/4 animate-pulse rounded bg-muted" />
            </div>
            <div className="h-4 w-16 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={`grid-skeleton-${i}`} className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="aspect-[16/10] animate-pulse bg-muted" />
          <div className="space-y-3 p-4">
            <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
