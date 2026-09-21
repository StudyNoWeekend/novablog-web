"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FolderOpen, ArrowRight } from "lucide-react";
import { categories, getModuleConfig, Category } from "@/lib/api";
import { ModuleDisabled } from "@/components/module-disabled";
import { ErrorState } from "@/components/error-state";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoriesPage() {
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [articleEnabled, setArticleEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [cats, modules] = await Promise.all([
        categories.list(),
        getModuleConfig(),
      ]);
      setCategoryList(cats);
      setArticleEnabled(modules.article_enabled);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载分类失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  if (!loading && !articleEnabled) {
    return <ModuleDisabled moduleLabel="文章" />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          分类
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          共 {categoryList.length} 个分类，点击查看对应文章
        </p>
      </header>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <ErrorState title="分类加载失败" message={error} onRetry={fetchAll} />
      ) : categoryList.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border py-16 text-center text-muted-foreground">
          暂无分类
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categoryList.map((category) => (
            <Link
              key={category.id}
              href={`/articles?category_id=${category.id}`}
              className="group rounded-lg border border-border bg-card p-5 transition-all duration-200 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <FolderOpen className="h-5 w-5" aria-hidden="true" />
                </span>
                <ArrowRight
                  className="h-4 w-4 text-muted-foreground transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-primary"
                  aria-hidden="true"
                />
              </div>
              <h2 className="mt-4 font-semibold text-foreground transition-colors group-hover:text-primary">
                {category.name}
              </h2>
              {category.description && (
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {category.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
