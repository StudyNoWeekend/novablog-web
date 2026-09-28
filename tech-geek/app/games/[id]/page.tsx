import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Gamepad2, Star, Timer } from "lucide-react";
import { games, getModuleConfig, GameDetail } from "@/lib/api";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { ModuleDisabled } from "@/components/module-disabled";
import { PlayStatusBadge } from "@/components/game-card";

interface PageProps {
  params: Promise<{ id: string }>;
}

// 后端不可达时的构建占位 id（output: export 不允许 generateStaticParams 返回空数组）；
// 该占位页渲染时不发任何请求，直接 404，保证构建不依赖后端可达（主题规范 3.4）
const FALLBACK_ID = "__fallback__";

export const dynamicParams = false;

export async function generateStaticParams() {
  try {
    const res = await games.list({ page: 1, page_size: 100 });
    if (res.list.length === 0) return [{ id: FALLBACK_ID }];
    return res.list.map((game) => ({ id: game.id }));
  } catch {
    return [{ id: FALLBACK_ID }];
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  if (id === FALLBACK_ID) {
    return { title: "游戏未找到" };
  }
  try {
    const game = await games.detail(id);
    return { title: game.title, description: `${game.title} · ${game.platform}` };
  } catch {
    return { title: "游戏未找到" };
  }
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

  let game: GameDetail;
  try {
    game = await games.detail(id);
  } catch {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* 返回 */}
      <div className="mx-auto w-full max-w-5xl px-4 pt-8 sm:px-6 lg:px-8">
        <Link
          href="/games"
          className="inline-flex min-h-10 items-center gap-1.5 rounded-md text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          返回游戏库
        </Link>
      </div>

      {/* 封面 + 游戏信息 */}
      <header className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
          {game.cover ? (
            <Image
              src={game.cover}
              alt={game.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1024px"
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-700 via-blue-900 to-slate-900">
              <Gamepad2 className="h-10 w-10 text-white/70" aria-hidden="true" />
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-start gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            {game.title}
          </h1>
          <PlayStatusBadge status={game.play_status} />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          {game.platform && (
            <span className="flex items-center gap-1.5">
              <Gamepad2 className="h-4 w-4" aria-hidden="true" />
              {game.platform}
            </span>
          )}
          {game.genre && <span>{game.genre}</span>}
          {game.play_hours > 0 && (
            <span className="flex items-center gap-1.5">
              <Timer className="h-4 w-4" aria-hidden="true" />
              已游玩 {game.play_hours} 小时
            </span>
          )}
          {game.rating > 0 && (
            <span className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
              {game.rating} / 10
            </span>
          )}
        </div>
      </header>

      {/* 简评正文 */}
      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 lg:px-8 md:py-10">
        <section>
          <h2 className="mb-6 text-2xl font-bold text-foreground">游戏简评</h2>
          {game.short_review ? (
            <MarkdownRenderer content={game.short_review} />
          ) : (
            <p className="rounded-lg border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
              暂无简评
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
