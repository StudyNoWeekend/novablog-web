import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Camera } from "lucide-react";
import { getPortfolios, getPortfolioById } from "@/lib/api/portfolios";
import { getModuleConfig } from "@/lib/api/module-config";
import { PortfolioCard } from "@/components/PortfolioCard";
import { ModuleDisabled } from "@/components/ModuleDisabled";

interface PageProps {
  params: Promise<{ id: string }>;
}

// 后端不可达时的构建占位 id（output: export 不允许 generateStaticParams 返回空数组）；
// 该占位页渲染时不发任何请求，直接 404，保证构建不依赖后端可达（主题规范 3.4）
const FALLBACK_ID = "__fallback__";

export const dynamicParams = false;

export async function generateStaticParams() {
  const res = await getPortfolios({ page: 1, page_size: 100 });
  if (res.list.length === 0) return [{ id: FALLBACK_ID }];
  return res.list.map((portfolio) => ({ id: portfolio.id }));
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  if (id === FALLBACK_ID) {
    return { title: "作品集未找到" };
  }
  const portfolio = await getPortfolioById(id);
  if (!portfolio) return { title: "作品集未找到" };
  return {
    title: portfolio.name,
    description: portfolio.description || undefined,
  };
}

export default async function PortfolioDetailPage({ params }: PageProps) {
  const config = await getModuleConfig();
  if (!config.portfolio_enabled) {
    return <ModuleDisabled moduleLabel="作品集" />;
  }

  const { id } = await params;
  if (id === FALLBACK_ID) {
    notFound();
  }
  const portfolio = await getPortfolioById(id);
  if (!portfolio) {
    notFound();
  }

  const items = portfolio.items ?? [];
  const morePortfolios = (await getPortfolios({ page: 1, page_size: 100 })).list
    .filter((item) => item.id !== portfolio.id)
    .slice(0, 3);

  return (
    <div className="flex flex-1 flex-col bg-background">
      {/* Back link */}
      <div className="mx-auto w-full max-w-5xl px-4 pt-8 sm:px-6 lg:px-8">
        <Link
          href="/portfolio"
          className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 text-sm text-text-muted transition-colors duration-200 hover:text-accent-hover"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          返回作品集
        </Link>
      </div>

      {/* Hero cover */}
      <header className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="relative aspect-[21/9] overflow-hidden rounded-xl bg-surface-highlight shadow-card">
          {portfolio.cover_url ? (
            <Image
              src={portfolio.cover_url}
              alt={portfolio.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1024px"
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-text-subtle">
              <Camera className="h-10 w-10" strokeWidth={1.2} />
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8 md:py-10">
        {portfolio.category_name && (
          <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold text-ink">
            {portfolio.category_name}
          </span>
        )}
        <h1 className="mt-3 font-display text-3xl leading-tight text-text-primary md:text-4xl">
          {portfolio.name}
        </h1>
        {portfolio.description && (
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-text-muted">
            {portfolio.description}
          </p>
        )}

        {/* 作品项方形网格 */}
        {items.length > 0 ? (
          <section className="mt-12">
            <h2 className="mb-6 font-display text-2xl text-text-primary">
              作品一览
              <span className="ml-3 align-middle text-sm font-normal text-text-subtle">
                {items.length} 个作品
              </span>
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item, index) => (
                <figure
                  key={item.id}
                  className="group flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-card"
                >
                  <div className="relative aspect-square overflow-hidden bg-background-soft">
                    {item.output_url ? (
                      <Image
                        src={item.output_url}
                        alt={item.title || `作品 ${index + 1}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-text-subtle">
                        <Camera className="h-8 w-8 text-accent-hover/40" strokeWidth={1.2} />
                      </div>
                    )}
                  </div>
                  {(item.title || item.description) && (
                    <figcaption className="p-4">
                      {item.title && (
                        <p className="text-sm font-semibold text-text-primary">
                          {item.title}
                        </p>
                      )}
                      {item.description && (
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-text-muted">
                          {item.description}
                        </p>
                      )}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </section>
        ) : (
          <div className="mt-12 rounded-xl border border-dashed border-border-strong py-16 text-center text-sm text-text-muted">
            该作品集暂无作品
          </div>
        )}
      </div>

      {/* 更多作品集 */}
      {morePortfolios.length > 0 && (
        <section className="border-t border-border bg-surface-highlight py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 font-display text-2xl text-text-primary">
              更多作品集
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {morePortfolios.map((item) => (
                <PortfolioCard key={item.id} portfolio={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
