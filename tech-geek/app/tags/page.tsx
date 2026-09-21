"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getModuleConfig, tags, Tag } from "@/lib/api";
import { ModuleDisabled } from "@/components/module-disabled";
import { ErrorState } from "@/components/error-state";
import { Skeleton } from "@/components/ui/skeleton";

export default function TagsPage() {
  const [tagList, setTagList] = useState<Tag[]>([]);
  const [articleEnabled, setArticleEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [tagRes, modules] = await Promise.all([
        tags.list(),
        getModuleConfig(),
      ]);
      setTagList(tagRes);
      setArticleEnabled(modules.article_enabled);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载标签失败");
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
          标签
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          共 {tagList.length} 个标签，点击查看相关文章
        </p>
      </header>

      {loading ? (
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-full" />
          ))}
        </div>
      ) : error ? (
        <ErrorState title="标签加载失败" message={error} onRetry={fetchAll} />
      ) : tagList.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border py-16 text-center text-muted-foreground">
          暂无标签
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {tagList.map((tag) => (
            <Link
              key={tag.id}
              href={`/articles?tag=${encodeURIComponent(tag.name)}`}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors duration-200 hover:border-primary/40 hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {tag.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
