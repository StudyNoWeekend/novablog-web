import Link from "next/link";
import Image from "next/image";
import { Gamepad2, Star, Timer } from "lucide-react";
import type { Game } from "@/lib/api";

/** 游玩状态映射：want=想玩 playing=在玩 played=玩过（低饱和徽标区分） */
export const PLAY_STATUS_META: Record<string, { label: string; className: string }> = {
  want: {
    label: "想玩",
    className: "border-sky-700/25 bg-sky-700/10 text-sky-800 dark:text-sky-300",
  },
  playing: {
    label: "在玩",
    className: "border-emerald-700/25 bg-emerald-700/10 text-emerald-800 dark:text-emerald-300",
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
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${meta.className}`}
    >
      {meta.label}
    </span>
  );
}

/** 游戏卡片：封面 + 游玩状态角标 + 标题 + 平台/类型 + 评分(x/10) + 时长 */
export function GameCard({ game }: { game: Game }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/40 focus-within:ring-2 focus-within:ring-ring">
      <Link
        href={`/games/${game.id}`}
        className="relative block aspect-video overflow-hidden bg-muted"
        aria-label={game.title}
      >
        {game.cover ? (
          <Image
            src={game.cover}
            alt={game.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <Gamepad2 className="size-10" aria-hidden="true" />
          </div>
        )}
        <span className="absolute left-3 top-3">
          <PlayStatusBadge status={game.play_status} />
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-heading text-lg font-medium text-foreground">
          <Link
            href={`/games/${game.id}`}
            className="rounded transition-colors group-hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
          >
            {game.title}
          </Link>
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {game.platform && (
            <span className="flex items-center gap-1">
              <Gamepad2 className="size-3.5" aria-hidden="true" />
              {game.platform}
            </span>
          )}
          {game.genre && <span>{game.genre}</span>}
          {game.play_hours > 0 && (
            <span className="flex items-center gap-1">
              <Timer className="size-3.5" aria-hidden="true" />
              {game.play_hours} 小时
            </span>
          )}
          {game.rating > 0 && (
            <span className="flex items-center gap-1">
              <Star className="size-3.5 fill-primary text-primary" aria-hidden="true" />
              {game.rating} / 10
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
