"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { likeTravel } from "@/lib/api/travels";

interface TravelLikeButtonProps {
  travelId: string;
  initialCount: number;
}

export function TravelLikeButton({
  travelId,
  initialCount,
}: TravelLikeButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (liked || loading) return;
    setLoading(true);
    // Optimistic update, rollback on failure
    setCount((c) => c + 1);
    setLiked(true);
    const ok = await likeTravel(travelId);
    if (!ok) {
      setCount((c) => Math.max(c - 1, 0));
      setLiked(false);
    }
    setLoading(false);
  };

  return (
    <button
      type="button"
      onClick={handleLike}
      disabled={liked || loading}
      aria-pressed={liked}
      aria-label={liked ? "已点赞" : "点赞"}
      className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-5 text-sm font-medium transition-all duration-200 ease-out disabled:cursor-default ${
        liked
          ? "border-accent bg-accent-subtle text-accent"
          : "border-border bg-surface text-text-secondary hover:border-accent hover:text-accent"
      }`}
    >
      <Heart
        className={`h-4 w-4 ${liked ? "fill-accent" : ""}`}
        strokeWidth={1.6}
      />
      <span className="tabular-nums">{count}</span>
      <span>{liked ? "已点赞" : "点赞"}</span>
    </button>
  );
}
