import Link from "next/link";
import Image from "next/image";
import { Gamepad2, Star, Timer } from "lucide-react";
import type { Game } from "@/lib/api";

/** 游玩状态映射：want=想玩 playing=在玩 played=玩过（徽标配色区分） */
export const PLAY_STATUS_META: Record<string, { label: string; className: string }> = {
  want: {
    label: "想玩",
    className: "border-sky-500/40 bg-sky-500/10 text-sky-500",
  },
  playing: {
    label: "在玩",
    className: "border-emerald-500/40 bg-emerald-500/10 text-emerald-500",
  },
  played: {
    label: "玩过",
    className: "border-primary/40 bg-primary/10 text-primary",
  },
};

/** 游玩状态徽标（未知状态不渲染） */
export function PlayStatusBadge({ status }: { status: string }) {
  const meta = PLAY_STATUS_META[status];
  if (!meta) return null;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium backdrop-blur ${meta.className}`}
    >
      {meta.label}
    </span>
  );
}

/** 游戏卡片：封面 + 游玩状态角标 + 标题 + 平台/类型 + 评分(x/10) + 时长 */
export function GameCard({ game }: { game: Game }) {
  return (
    <Link
      href={`/games/${game.id}`}
      aria-label={game.title}
      className="group card-lift flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-card focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative aspect-video overflow-hidden">
        {game.cover ? (
          <Image
            src={game.cover}
            alt={game.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <Gamepad2 className="h-10 w-10 text-muted-foreground/60" />
          </div>
        )}
        <span className="absolute left-3 top-3">
          <PlayStatusBadge status={game.play_status} />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-base font-semibold text-foreground transition-colors group-hover:text-primary">
          {game.title}
        </h3>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {game.platform && (
            <span className="flex items-center gap-1">
              <Gamepad2 className="h-3.5 w-3.5" aria-hidden="true" />
              {game.platform}
            </span>
          )}
          {game.genre && <span>{game.genre}</span>}
          {game.play_hours > 0 && (
            <span className="flex items-center gap-1">
              <Timer className="h-3.5 w-3.5" aria-hidden="true" />
              {game.play_hours} 小时
            </span>
          )}
          {game.rating > 0 && (
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
              {game.rating} / 10
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
