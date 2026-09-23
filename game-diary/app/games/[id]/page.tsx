import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Building2, Search } from "lucide-react";
import { getGameById, getGames } from "@/lib/api/games";
import { getModuleConfig } from "@/lib/api/module-config";
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

  if (!game) {
    return { title: "游戏未找到" };
  }

  return {
    title: game.name,
    description: game.description,
  };
}

export default async function GameDetailPage({ params }: PageProps) {
  const config = await getModuleConfig();
  if (!config.equipment_enabled) {
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

  return (
    <div className="flex flex-1 flex-col bg-background">
      {/* Back link */}
      <div className="mx-auto w-full max-w-5xl px-4 pt-8 sm:px-6 lg:px-8">
        <Link
          href="/games"
          className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 text-sm text-text-muted transition-colors duration-200 hover:text-accent-hover"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          返回游戏库
        </Link>
      </div>

      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8 md:py-10">
        {/* Cover */}
        {game.image_url ? (
          <div className="relative aspect-[21/9] overflow-hidden rounded-radius-lg shadow-card">
            <Image
              src={game.image_url}
              alt={game.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1024px"
              className="object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
              {game.brand && (
                <span className="mb-3 inline-block rounded-full bg-gradient-theme px-3 py-1 text-xs font-bold text-white">
                  {game.brand}
                </span>
              )}
              <h1 className="max-w-3xl font-heading text-2xl font-black leading-tight text-white md:text-4xl">
                {game.name}
              </h1>
            </div>
          </div>
        ) : (
          <header>
            {game.brand && (
              <span className="mb-3 inline-block rounded-full bg-accent-subtle px-3 py-1 text-xs font-semibold text-accent-hover">
                {game.brand}
              </span>
            )}
            <h1 className="font-heading text-3xl font-black leading-tight text-text-primary md:text-4xl">
              {game.name}
            </h1>
          </header>
        )}

        {/* Description */}
        <div className="mx-auto w-full max-w-3xl py-10">
          {game.description ? (
            <p className="whitespace-pre-line text-base leading-loose text-text-secondary">
              {game.description}
            </p>
          ) : (
            <p className="text-sm text-text-subtle">暂无游戏介绍。</p>
          )}

          {/* Meta */}
          {game.brand && (
            <div className="mt-8 flex items-center gap-2 text-sm text-text-muted">
              <Building2 className="h-4 w-4 text-text-subtle" strokeWidth={1.5} />
              开发 / 发行：{game.brand}
            </div>
          )}

          {/* Related articles entry */}
          <Link
            href={`/articles?keyword=${encodeURIComponent(game.name)}`}
            className="mt-10 flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-gradient-theme text-sm font-bold text-white shadow-glow transition-opacity duration-200 ease-out hover:opacity-90"
          >
            <Search className="h-4 w-4" strokeWidth={1.8} />
            查找「{game.name}」相关攻略文章
          </Link>
        </div>
      </div>
    </div>
  );
}
