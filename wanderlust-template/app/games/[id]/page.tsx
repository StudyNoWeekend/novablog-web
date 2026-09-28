import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Timer } from "lucide-react";
import { getGames, getGameById } from "@/lib/api/games";
import { getModuleConfig } from "@/lib/api/module-config";
import { GameCard, PLAY_STATUS_LABELS } from "@/components/GameCard";
import { MarkdownContent } from "@/components/MarkdownContent";
import { ModuleDisabled } from "@/components/ModuleDisabled";

interface PageProps {
  params: Promise<{ id: string }>;
}

// 后端不可达时的构建占位 id（output: export 不允许 generateStaticParams 返回空数组）；
// 该占位页渲染时不发任何请求，直接 404，保证构建不依赖后端可达（主题规范 3.4）
const FALLBACK_ID = "__fallback__";

export const dynamicParams = false;

export async function generateStaticParams() {
  const res = await getGames({ page: 1, page_size: 100 });
  if (res.list.length === 0) return [{ id: FALLBACK_ID }];
  return res.list.map((game) => ({ id: game.id }));
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  if (id === FALLBACK_ID) {
    return { title: "游戏未找到" };
  }
  const game = await getGameById(id);
  if (!game) return { title: "游戏未找到" };
  return {
    title: game.title,
    description: game.genre || game.platform || undefined,
  };
}

export default async function GameDetailPage({ params }: PageProps) {
  const config = await getModuleConfig();
  if (!config.game_enabled) {
    return <ModuleDisabled moduleLabel="游戏库" />;
  }

  const { id } = await params;
  if (id === FALLBACK_ID) {
    notFound();
  }
  const game = await getGameById(id);
  if (!game) {
    notFound();
  }

  const statusLabel = PLAY_STATUS_LABELS[game.play_status];

  const moreGames = (await getGames({ page: 1, page_size: 100 })).list
    .filter((item) => item.id !== game.id)
    .slice(0, 3);

  return (
    <div className="flex flex-1 flex-col bg-background">
      {/* Back link */}
      <div className="mx-auto w-full max-w-5xl px-4 pt-8 sm:px-6 lg:px-8">
        <Link
          href="/games"
          className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 text-sm text-text-muted transition-colors duration-200 hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          返回游戏库
        </Link>
      </div>

      {/* Hero cover */}
      <header className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="relative aspect-[21/9] overflow-hidden rounded-radius-lg bg-background-soft shadow-card">
          {game.cover ? (
            <Image
              src={game.cover}
              alt={game.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1024px"
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-text-subtle">
              <span className="text-sm">暂无封面</span>
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 lg:px-8 md:py-10">
        {/* 状态徽标 + 评分 */}
        <div className="flex flex-wrap items-center gap-3">
          {statusLabel && (
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-white">
              {statusLabel}
            </span>
          )}
          {game.rating > 0 && (
            <span className="rounded-full bg-accent-subtle px-3 py-1 text-xs font-semibold text-accent">
              评分 {game.rating} / 10
            </span>
          )}
        </div>

        <h1 className="mt-3 font-display text-3xl leading-tight text-text-primary md:text-4xl">
          {game.title}
        </h1>

        {/* 平台 / 类型 / 时长 */}
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-text-muted">
          {game.platform && (
            <span className="rounded-full border border-border bg-surface px-3 py-1 text-xs">
              {game.platform}
            </span>
          )}
          {game.genre && <span>{game.genre}</span>}
          {game.play_hours > 0 && (
            <span className="flex items-center gap-1.5">
              <Timer className="h-4 w-4 text-text-subtle" strokeWidth={1.5} />
              已游玩 {game.play_hours} 小时
            </span>
          )}
        </div>

        {/* 短评（Markdown 渲染，纯文本亦可） */}
        {game.short_review && (
          <article className="mt-10 border-t border-border pt-10">
            <h2 className="mb-6 font-display text-2xl text-text-primary">
              短评
            </h2>
            <MarkdownContent content={game.short_review} />
          </article>
        )}
      </div>

      {/* 更多游戏 */}
      {moreGames.length > 0 && (
        <section className="border-t border-border bg-background-soft py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 font-display text-2xl text-text-primary">
              更多游戏
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {moreGames.map((item) => (
                <GameCard key={item.id} game={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
