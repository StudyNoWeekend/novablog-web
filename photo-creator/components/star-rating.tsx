import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  /** 评分 0-5 */
  value: number;
  className?: string;
}

/** 五星评分展示（超出范围自动截断到 0-5），空星用弱化色 */
export function StarRating({ value, className }: StarRatingProps) {
  const clamped = Math.max(0, Math.min(5, value));
  return (
    <span className={cn("flex items-center gap-0.5", className)} aria-label={`评分 ${clamped} / 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "size-3.5",
            star <= Math.round(clamped)
              ? "fill-primary text-primary"
              : "text-muted-foreground/30"
          )}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}
