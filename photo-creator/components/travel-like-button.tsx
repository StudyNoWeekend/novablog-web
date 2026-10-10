"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { travels } from "@/lib/api";

interface TravelLikeButtonProps {
  travelId: string;
  initialCount: number;
}

/** 点赞按钮：乐观更新，失败回滚（点赞状态不持久化，仅本次会话） */
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
        "inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full border px-5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-default",
        liked
          ? "border-primary bg-primary/10 text-primary"
          : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
      )}
    >
      <Heart
        className={cn("size-4", liked && "fill-primary text-primary")}
        aria-hidden="true"
      />
      <span className="tabular-nums">{count}</span>
      <span>{liked ? "已点赞" : "点赞"}</span>
    </button>
  );
}
