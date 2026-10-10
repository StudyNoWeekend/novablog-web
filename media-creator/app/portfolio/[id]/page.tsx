import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Images } from "lucide-react";
import { portfolios, moduleConfig, ALL_ENABLED, type Portfolio } from "@/lib/api";
import { PortfolioCard } from "@/components/portfolio-card";
import { ModuleDisabled } from "@/components/module-disabled";

interface PageProps {
  params: Promise<{ id: string }>;
}

// 后端不可达时的构建占位 id（output: export 不允许 generateStaticParams 返回空数组）；
// 该占位页渲染时不发任何请求，直接 404，保证构建不依赖后端可达（主题规范 3.4）
const FALLBACK_ID = "__fallback__";

export const dynamicParams = false;

export async function generateStaticParams() {
  try {
    const res = await portfolios.list({ page: 1, page_size: 100 });
    if (res.list.length === 0) return [{ id: FALLBACK_ID }];
    return res.list.map((portfolio) => ({ id: portfolio.id }));
  } catch {
    return [{ id: FALLBACK_ID }];
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  if (id === FALLBACK_ID) {
    return { title: "作品集未找到" };
  }
  try {
    const portfolio = await portfolios.detail(id);
    return { title: portfolio.name, description: portfolio.description || undefined };
  } catch {
    return { title: "作品集未找到" };
  }
}

export default async function PortfolioDetailPage({ params }: PageProps) {
  const config = await moduleConfig.get().catch(() => ALL_ENABLED);
  if (!config.portfolio_enabled) {
    return <ModuleDisabled moduleLabel="作品集" />;
  }

  const { id } = await params;
  if (id === FALLBACK_ID) {
    notFound();
  }

  let portfolio;
  try {
    portfolio = await portfolios.detail(id);
  } catch {
    notFound();
  }

  // 更多作品集：列表取数，过滤当前作品集（失败静默省略该区块）
  let morePortfolios: Portfolio[] = [];
  try {
    const res = await portfolios.list({ page: 1, page_size: 100 });
    morePortfolios = res.list.filter((item) => item.id !== portfolio.id).slice(0, 3);
  } catch {
    morePortfolios = [];
  }

  const items = portfolio.items ?? [];

  return (
    <div className="min-h-screen py-10 lg:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/portfolio"
          className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft className="h-4 w-4" />
          返回作品集
        </Link>

        {/* Hero 封面 */}
        <header className="mt-6">
          <div className="relative aspect-[21/9] overflow-hidden rounded-2xl border border-border bg-muted shadow-sm">
            {portfolio.cover_url ? (
              <Image
                src={portfolio.cover_url}
                alt={portfolio.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 1024px"
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <Images className="h-10 w-10 text-muted-foreground/60" />
              </div>
            )}
          </div>
        </header>

        {/* 简介 */}
        <div className="mt-6">
          {portfolio.category_name && (
            <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              {portfolio.category_name}
            </span>
          )}
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
            {portfolio.name}
          </h1>
          {portfolio.description && (
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">
              {portfolio.description}
            </p>
          )}
        </div>

        {/* 作品方形网格 */}
        {items.length > 0 ? (
          <section className="mt-12">
            <h2 className="flex items-center gap-3 font-hand text-2xl text-foreground">
              作品一览
              <span className="text-sm font-normal text-muted-foreground">
                {items.length} 个作品
              </span>
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item, index) => (
                <figure
                  key={item.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card"
                >
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    {item.output_url ? (
                      <Image
                        src={item.output_url}
                        alt={item.title || `作品 ${index + 1}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted">
                        <Images className="h-8 w-8 text-muted-foreground/60" />
                      </div>
                    )}
                  </div>
                  {(item.title || item.description) && (
                    <figcaption className="p-4">
                      {item.title && (
                        <p className="text-sm font-semibold text-foreground">{item.title}</p>
                      )}
                      {item.description && (
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
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
          <div className="mt-12 rounded-2xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
            该作品集暂无作品
          </div>
        )}
      </div>

      {/* 更多作品集 */}
      {morePortfolios.length > 0 && (
        <section className="mt-14 border-t border-border pt-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-hand text-2xl text-foreground">更多作品集</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
