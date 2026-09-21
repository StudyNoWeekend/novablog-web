import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Images } from "lucide-react";
import { portfolios, getModuleConfig, PortfolioDetail } from "@/lib/api";
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
    return { title: portfolio.name, description: portfolio.description };
  } catch {
    return { title: "作品集未找到" };
  }
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

  let portfolio: PortfolioDetail;
  try {
    portfolio = await portfolios.detail(id);
  } catch {
    notFound();
  }

  const items = portfolio.items ?? [];

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <Link
          href="/portfolio"
          className="inline-flex min-h-10 items-center gap-1.5 rounded-md text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          返回作品集
        </Link>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            {portfolio.name}
          </h1>
          {portfolio.description && (
            <p className="mt-2 max-w-3xl leading-relaxed text-muted-foreground">
              {portfolio.description}
            </p>
          )}
          {items.length > 0 && (
            <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Images className="h-4 w-4" aria-hidden="true" />
              共 {items.length} 个作品
            </p>
          )}
        </header>

        {items.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border py-16 text-center text-muted-foreground">
            该作品集暂无作品
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, i) => (
              <figure
                key={item.id}
                className="group overflow-hidden rounded-lg border border-border bg-card transition-all duration-200 hover:border-primary/40 hover:shadow-md"
              >
                <a
                  href={item.output_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative block aspect-[4/3] overflow-hidden bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={item.title || `作品 ${i + 1}`}
                >
                  {item.output_url ? (
                    <Image
                      src={item.output_url}
                      alt={item.title || `作品 ${i + 1}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                      <Images className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
                    </div>
                  )}
                </a>
                {(item.title || item.description) && (
                  <figcaption className="p-4">
                    {item.title && (
                      <h2 className="font-semibold text-foreground">{item.title}</h2>
                    )}
                    {item.description && (
                      <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    )}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
