import Link from "next/link";
import { Eye, Flame, Search } from "lucide-react";
import { ArticleCard } from "@/components/ArticleCard";
import { ModuleDisabled } from "@/components/ModuleDisabled";
import { getArticles } from "@/lib/api/articles";
import { getCategories } from "@/lib/api/categories";
import { getHotArticles } from "@/lib/api/articles";
import { getTags } from "@/lib/api/tags";
import { getModuleConfig } from "@/lib/api/module-config";

export const dynamic = "force-dynamic";

interface SearchParams {
  category_id?: string;
  keyword?: string;
  page?: string;
}

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const config = await getModuleConfig();
  if (!config.article_enabled) {
    return <ModuleDisabled moduleLabel="文章" />;
  }

  const params = await searchParams;
  const currentPage = params.page ? Number(params.page) : 1;

  const [articlesData, categories, hotArticles, tags] = await Promise.all([
    getArticles({
      category_id: params.category_id,
      keyword: params.keyword,
      page: currentPage,
      page_size: 12,
    }),
    getCategories(),
    getHotArticles(5),
    getTags(),
  ]);

  const articles = articlesData.list;
  const activeCategoryId = params.category_id ?? "";
  const currentKeyword = params.keyword ?? "";

  return (
    <div className="flex flex-1 flex-col bg-background">
      {/* Page Header */}
      <section className="border-b border-border bg-background-soft py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="font-[var(--font-playfair)] text-4xl font-bold text-text-primary md:text-5xl">
            文章
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-text-muted md:text-lg">
            记录旅途中的光影、器材的心得与后期的思考。每一篇文章，都是一次与世界的对话。
          </p>

          {/* Keyword Search */}
          <form action="/articles" method="GET" className="mx-auto mt-8 flex max-w-md items-center">
            {params.category_id && (
              <input type="hidden" name="category_id" value={params.category_id} />
            )}
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle"
                strokeWidth={1.5}
              />
              <input
                type="search"
                name="keyword"
                defaultValue={currentKeyword}
                placeholder="搜索文章标题..."
                aria-label="搜索文章"
                className="min-h-11 w-full rounded-full border border-border bg-surface pl-10 pr-4 text-sm text-text-primary placeholder:text-text-subtle focus:border-accent focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="ml-2 min-h-11 shrink-0 cursor-pointer rounded-full bg-accent px-5 text-sm font-medium text-background transition-colors duration-200 ease-out hover:bg-accent-hover"
            >
              搜索
            </button>
          </form>
        </div>
      </section>

      {/* Category Filter */}
      <section className="sticky top-[72px] z-30 border-b border-border bg-background/95 py-4 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
            <Link
              href={buildHref({ category_id: "", keyword: currentKeyword })}
              className={`min-h-11 cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ease-out ${
                activeCategoryId === ""
                  ? "bg-accent text-background"
                  : "border border-border bg-surface text-text-muted hover:border-accent hover:text-accent"
              }`}
            >
              全部
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={buildHref({ category_id: category.id, keyword: currentKeyword })}
                className={`min-h-11 cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ease-out ${
                  activeCategoryId === category.id
                    ? "bg-accent text-background"
                    : "border border-border bg-surface text-text-muted hover:border-accent hover:text-accent"
                }`}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Article List + Sidebar */}
      <section className="flex-1 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-8">
              {/* Main column */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {articles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>

                {/* Pagination */}
                {articlesData.total_pages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    {currentPage > 1 && (
                      <Link
                        href={buildHref({ ...params, page: String(currentPage - 1) })}
                        className="flex h-10 cursor-pointer items-center rounded-full border border-border bg-surface px-4 text-sm text-text-secondary transition-colors duration-200 hover:border-accent hover:text-accent"
                      >
                        上一页
                      </Link>
                    )}
                    <span className="px-4 text-sm text-text-muted">
                      {currentPage} / {articlesData.total_pages}
                    </span>
                    {currentPage < articlesData.total_pages && (
                      <Link
                        href={buildHref({ ...params, page: String(currentPage + 1) })}
                        className="flex h-10 cursor-pointer items-center rounded-full border border-border bg-surface px-4 text-sm text-text-secondary transition-colors duration-200 hover:border-accent hover:text-accent"
                      >
                        下一页
                      </Link>
                    )}
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <aside className="space-y-8 lg:sticky lg:top-[144px] lg:self-start">
                {/* Hot Articles */}
                {hotArticles.length > 0 && (
                  <div className="rounded-radius-md border border-border bg-surface p-5 shadow-card">
                    <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-text-primary">
                      <Flame className="h-4 w-4 text-accent" strokeWidth={1.5} />
                      热门文章
                    </h2>
                    <ol className="space-y-4">
                      {hotArticles.map((article, index) => (
                        <li key={article.id}>
                          <Link
                            href={`/articles/${article.slug}`}
                            className="group flex items-start gap-3"
                          >
                            <span
                              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-sm text-xs font-semibold ${
                                index < 3
                                  ? "bg-accent text-background"
                                  : "bg-background-soft text-text-subtle"
                              }`}
                            >
                              {index + 1}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="line-clamp-2 text-sm leading-snug text-text-secondary transition-colors duration-200 group-hover:text-accent">
                                {article.title}
                              </span>
                              <span className="mt-1 flex items-center gap-1 text-xs text-text-subtle">
                                <Eye className="h-3 w-3" strokeWidth={1.5} />
                                {article.view_count}
                              </span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Tag Cloud */}
                {tags.length > 0 && (
                  <div className="rounded-radius-md border border-border bg-surface p-5 shadow-card">
                    <h2 className="mb-4 text-base font-semibold text-text-primary">
                      标签云
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Link
                          key={tag.id}
                          href={`/articles?keyword=${encodeURIComponent(tag.name)}`}
                          className="min-h-8 cursor-pointer rounded-full border border-border bg-background-soft px-3 py-1 text-xs text-text-muted transition-colors duration-200 hover:border-accent hover:text-accent"
                        >
                          #{tag.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </aside>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-lg text-text-muted">
                {params.keyword
                  ? `未找到与「${params.keyword}」相关的文章`
                  : "该分类下暂无文章"}
              </p>
              <Link
                href="/articles"
                className="mt-4 cursor-pointer text-sm font-medium text-accent transition-colors duration-200 ease-out hover:text-accent-hover"
              >
                查看全部文章
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function buildHref(params: Record<string, string | undefined>): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });
  const qs = query.toString();
  return qs ? `/articles?${qs}` : "/articles";
}
