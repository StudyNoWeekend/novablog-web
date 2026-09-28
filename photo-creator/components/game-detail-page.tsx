"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Gamepad2, Star, Timer } from "lucide-react";
import type { GameDetail } from "@/lib/api";
import { MarkdownContent } from "./markdown-content";
import { PlayStatusBadge } from "./game-card";

interface GameDetailPageProps {
  game: GameDetail;
}

export function GameDetailPage({ game }: GameDetailPageProps) {
  return (
    <article className="bg-background">
      <div className="relative aspect-[21/9] w-full bg-muted md:aspect-[21/8]">
        {game.cover ? (
          <Image
            src={game.cover}
            alt={game.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <Gamepad2 className="size-12" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-16 lg:py-20">
        <Link
          href="/games"
          className="inline-flex items-center gap-1.5 rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          返回游戏库
        </Link>

        <header className="mt-8">
          <div className="flex flex-wrap items-start gap-3">
            <h1 className="font-heading text-3xl font-normal leading-tight text-foreground md:text-4xl lg:text-5xl">
              {game.title}
            </h1>
            <PlayStatusBadge status={game.play_status} />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            {game.platform && (
              <span className="inline-flex items-center gap-1.5">
                <Gamepad2 className="size-4" aria-hidden="true" />
                {game.platform}
              </span>
            )}
            {game.genre && <span>{game.genre}</span>}
            {game.play_hours > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <Timer className="size-4" aria-hidden="true" />
                已游玩 {game.play_hours} 小时
              </span>
            )}
            {game.rating > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <Star className="size-4 fill-primary text-primary" aria-hidden="true" />
                {game.rating} / 10
              </span>
            )}
          </div>
        </header>

        <section className="mt-12">
          <h2 className="mb-6 font-heading text-2xl font-medium text-foreground">游戏简评</h2>
          {game.short_review ? (
            <MarkdownContent content={game.short_review} />
          ) : (
            <p className="rounded-2xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
              暂无简评
            </p>
          )}
        </section>
      </div>
    </article>
  );
}
