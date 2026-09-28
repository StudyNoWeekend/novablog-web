import Link from "next/link";
import Image from "next/image";
import { Gamepad2, Star, Timer } from "lucide-react";
import { Game } from "@/lib/api";

/** 游玩状态映射：want=想玩 playing=在玩 played=玩过（徽标配色区分） */
export const PLAY_STATUS_META: Record<string, { label: string; className: string }> = {
  want: {
    label: "想玩",
    className: "border-sky-500/40 bg-sky-500/10 text-sky-600 dark:text-sky-400",
  },
  playing: {
    label: "在玩",
    className: "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
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
    <article className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all duration-200 hover:border-primary/40 hover:shadow-md focus-within:ring-2 focus-within:ring-ring">
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
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-700 via-blue-900 to-slate-900">
            <Gamepad2 className="h-8 w-8 text-white/70" aria-hidden="true" />
          </div>
        )}
        <span className="absolute left-3 top-3">
          <PlayStatusBadge status={game.play_status} />
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 font-semibold tracking-tight text-foreground">
          <Link
            href={`/games/${game.id}`}
            className="rounded transition-colors group-hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {game.title}
          </Link>
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
    </article>
  );
}
