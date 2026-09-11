"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Terminal, TrendingUp, Tag, Folder, ArrowRight } from "lucide-react";
import { articles, categories, tags, blogger, Blogger, Article, Category, Tag as TagType } from "@/lib/api";
import { ArticleCard } from "@/components/article-card";
import { ErrorState } from "@/components/error-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  const [info, setInfo] = useState<Blogger | null>(null);
  const [hotArticles, setHotArticles] = useState<Article[]>([]);
  const [latestArticles, setLatestArticles] = useState<Article[]>([]);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [tagList, setTagList] = useState<TagType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [bloggerRes, hotRes, latestRes, catRes, tagRes] = await Promise.all([
        blogger.get(),
        articles.hot(5),
        articles.list({ page: 1, page_size: 6 }),
        categories.list(),
        tags.list(),
      ]);
      setInfo(bloggerRes);
      setHotArticles(hotRes);
      setLatestArticles(latestRes.list);
      setCategoryList(catRes);
      setTagList(tagRes);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  if (loading) {
    return <HomeSkeleton />;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <ErrorState title="首页加载失败" message={error} onRetry={fetchAll} />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-card">
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full bg-[linear-gradient(rgba(34,211,238,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.1)_1px,transparent_1px)] bg-[size:2rem_2rem]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:gap-10">
            {info?.avatar && (
              <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-primary/30 md:h-32 md:w-32">
                <Image
                  src={info.avatar}
                  alt={info.nickname}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 font-mono text-sm text-primary">
                <Terminal className="h-4 w-4" />
                <span>{info?.blog_title || "Tech Geek Blog"}</span>
              </div>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
                {info?.nickname || "Developer"}
              </h1>
              <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
                {info?.bio || info?.blog_description || "记录代码、架构与技术思考。"}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild className="cursor-pointer">
                  <Link href="/articles">
                    浏览文章
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild className="cursor-pointer">
                  <Link href="/music">音乐</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hot / Featured */}
      {hotArticles.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-bold text-foreground md:text-2xl">
              <TrendingUp className="h-5 w-5 text-primary" />
              热门文章
            </h2>
            <Link
              href="/articles"
              className="flex items-center gap-1 text-sm text-primary transition-colors hover:text-primary/80"
            >
              全部文章 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {hotArticles.slice(0, 3).map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      )}

      {/* Latest */}
      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground md:text-2xl">最新文章</h2>
          <Link
            href="/articles"
            className="flex items-center gap-1 text-sm text-primary transition-colors hover:text-primary/80"
          >
            查看更多 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {latestArticles.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
            暂无文章
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latestArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </section>

      {/* Categories & Tags */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:px-8">
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
              <Folder className="h-5 w-5 text-primary" />
              分类
            </h3>
            <div className="flex flex-wrap gap-2">
              {categoryList.map((category) => (
                <Badge
                  key={category.id}
                  variant="outline"
                  className="cursor-pointer border-border font-mono text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                  asChild
                >
                  <Link href={`/articles?category_id=${category.id}`}>{category.name}</Link>
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
              <Tag className="h-5 w-5 text-primary" />
              标签云
            </h3>
            <div className="flex flex-wrap gap-2">
              {tagList.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/articles?tag=${encodeURIComponent(tag.name)}`}
                  className="rounded bg-muted px-2 py-1 font-mono text-xs text-muted-foreground transition-colors hover:text-primary"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function HomeSkeleton() {
  return (
    <div className="flex flex-col">
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:gap-10">
            <Skeleton className="h-24 w-24 rounded-full md:h-32 md:w-32" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-6 w-full max-w-xl" />
              <div className="flex gap-3 pt-2">
                <Skeleton className="h-10 w-28" />
                <Skeleton className="h-10 w-20" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Skeleton className="mb-6 h-8 w-40" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-72 rounded-lg" />
          ))}
        </div>
      </section>
    </div>
  );
}
