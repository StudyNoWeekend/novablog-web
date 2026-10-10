"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { travels } from "@/lib/api";
import { cn } from "@/lib/utils";

interface TravelLikeButtonProps {
  travelId: string;
  initialCount: number;
}

/** 攻略点赞按钮：乐观更新，失败回滚（每人次仅允许点赞一次） */
export function TravelLikeButton({ travelId, initialCount }: TravelLikeButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (liked || loading) return;
    setLoading(true);
    setCount((c) => c + 1);
    setLiked(true);
    try {
      await travels.like(travelId);
    } catch {
      setCount((c) => Math.max(c - 1, 0));
      setLiked(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLike}
      disabled={liked || loading}
      aria-pressed={liked}
      aria-label={liked ? "已点赞" : "点赞"}
      className={cn(
        "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-default",
        liked
          ? "border-primary/40 bg-primary/10 text-primary"
          : "border-input bg-card text-muted-foreground hover:border-primary hover:text-primary"
      )}
    >
      <Heart className={cn("h-4 w-4", liked && "fill-current")} aria-hidden="true" />
      <span className="tabular-nums">{count}</span>
      <span>{liked ? "已点赞" : "点赞"}</span>
    </button>
  );
}
