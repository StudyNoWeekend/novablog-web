"use client";

import Image from "next/image";
import Link from "next/link";
import { Gamepad2, Timer } from "lucide-react";
import { getFileUrl } from "@/lib/api/client";
import type { Game } from "@/lib/types";

interface GameCardProps {
  game: Game;
}

/** 游玩状态 → 徽标文案 */
export const PLAY_STATUS_LABELS: Record<string, string> = {
  want: "想玩",
  playing: "在玩",
  played: "玩过",
};

export function GameCard({ game }: GameCardProps) {
  const statusLabel = PLAY_STATUS_LABELS[game.play_status];

  return (
    <Link
      href={`/games/${game.id}`}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-radius-md border border-border bg-surface shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:border-accent/40 hover:shadow-card-hover"
    >
      {/* 封面 */}
      <div className="relative aspect-[16/9] overflow-hidden">
        {game.cover ? (
          <Image
            src={getFileUrl(game.cover)}
            alt={game.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-surface-elevated to-background-soft text-text-subtle">
            <Gamepad2 className="h-10 w-10" strokeWidth={1.5} />
          </div>
        )}
        {statusLabel && (
          <span className="absolute left-3 top-3 rounded-full bg-gradient-theme px-2.5 py-0.5 text-xs font-bold text-white shadow-glow">
            {statusLabel}
          </span>
        )}
      </div>

      {/* 信息 */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 flex-1 truncate font-heading text-lg font-bold leading-snug text-text-primary transition-colors duration-200 ease-out group-hover:text-accent-hover">
            {game.title}
          </h3>
          {game.rating > 0 && (
            <span className="shrink-0 rounded-full bg-accent-subtle px-2 py-0.5 text-xs font-bold text-accent-hover">
              {game.rating}/10
            </span>
          )}
        </div>

        {/* 平台 / 类型 / 时长 */}
        <div className="mt-3 flex flex-1 flex-wrap content-end items-center gap-x-3 gap-y-1.5 text-xs text-text-muted">
          {game.platform && (
            <span className="rounded-full bg-surface-elevated px-2 py-0.5">{game.platform}</span>
          )}
          {game.genre && <span>{game.genre}</span>}
          {game.play_hours > 0 && (
            <span className="flex items-center gap-1">
              <Timer className="h-3.5 w-3.5" strokeWidth={1.5} />
              {game.play_hours} 小时
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
