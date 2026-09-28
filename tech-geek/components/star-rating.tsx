import { Star } from "lucide-react";

interface StarRatingProps {
  /** 评分 0-5 */
  value: number;
}

/** 五星评分展示（超出范围自动截断到 0-5），空星用弱化色 */
export function StarRating({ value }: StarRatingProps) {
  const clamped = Math.max(0, Math.min(5, value));
  return (
    <span className="flex items-center gap-0.5" aria-label={`评分 ${clamped} / 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-3.5 w-3.5 ${
            star <= Math.round(clamped)
              ? "fill-amber-400 text-amber-400"
              : "text-muted-foreground/40"
          }`}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}
