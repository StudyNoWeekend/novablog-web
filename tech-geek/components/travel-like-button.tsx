"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { travels } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TravelLikeButtonProps {
  travelId: string;
  initialCount: number;
}

/** 攻略点赞：本地记忆防止重复点赞，失败静默（保持展示值） */
export function TravelLikeButton({ travelId, initialCount }: TravelLikeButtonProps) {
  const storageKey = `travel-liked-${travelId}`;
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    try {
      setLiked(localStorage.getItem(storageKey) === "1");
    } catch {
      // localStorage 不可用时忽略记忆
    }
  }, [storageKey]);

  const handleLike = async () => {
    if (liked) return;
    try {
      await travels.like(travelId);
      setLiked(true);
      setCount((c) => c + 1);
      try {
        localStorage.setItem(storageKey, "1");
      } catch {
        // 忽略
      }
    } catch {
      // 点赞失败静默，不打断浏览
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleLike}
      aria-pressed={liked}
      className={cn(
        "min-h-10 cursor-pointer gap-2 rounded-full px-5",
        liked && "border-primary/40 text-primary"
      )}
    >
      <Heart className={cn("h-4 w-4", liked && "fill-primary")} aria-hidden="true" />
      {liked ? "已点赞" : "点赞"}
      <span className="font-medium">{count}</span>
    </Button>
  );
}
