import { Skeleton } from "@/components/ui/skeleton";

interface CardGridSkeletonProps {
  /** 骨架卡片数量，默认 6 */
  count?: number;
  /** 布局变体：grid=封面卡网格（三列），row=横条列表（书籍/健身） */
  variant?: "grid" | "row";
}

/** 列表页加载骨架：与卡片网格同构的占位动画 */
export function CardGridSkeleton({ count = 6, variant = "grid" }: CardGridSkeletonProps) {
  if (variant === "row") {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={`row-skeleton-${i}`} className="flex items-center gap-4 rounded-lg border border-border bg-card p-4">
            <Skeleton className="h-12 w-12 shrink-0 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/4" />
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={`grid-skeleton-${i}`} className="overflow-hidden rounded-lg border border-border bg-card">
          <Skeleton className="aspect-[16/10] w-full rounded-none" />
          <div className="space-y-3 p-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
