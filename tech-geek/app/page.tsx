"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Flame,
  Tag,
  Folder,
  FolderOpen,
  ArrowRight,
  FileText,
  Terminal,
} from "lucide-react";
import {
  articles,
  categories,
  tags,
  blogger,
  getModuleConfig,
  Blogger,
  Article,
  Category,
  ModuleConfig,
  PaginatedResponse,
  Tag as TagType,
} from "@/lib/api";
import { ArticleListItem } from "@/components/article-list-item";
import { ProfileCard } from "@/components/profile-card";
import { ErrorState } from "@/components/error-state";
import { Skeleton } from "@/components/ui/skeleton";

const LATEST_COUNT = 5;

export default function HomePage() {
  const [info, setInfo] = useState<Blogger | null>(null);
  const [latest, setLatest] = useState<PaginatedResponse<Article> | null>(null);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [tagList, setTagList] = useState<TagType[]>([]);
  const [modules, setModules] = useState<ModuleConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const [bloggerRes, latestRes, catRes, tagRes, moduleRes] = await Promise.all([
        blogger.get(),
        articles.list({ page: 1, page_size: LATEST_COUNT }),
        categories.list(),
        tags.list(),
        getModuleConfig(),
      ]);
      setInfo(bloggerRes);
      setLatest(latestRes);
      setCategoryList(catRes);
      setTagList(tagRes);
      setModules(moduleRes);
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

  const articleEnabled = modules?.article_enabled ?? true;
  const latestArticles = latest?.list ?? [];
  const articleCount = latest?.total ?? 0;

  return (
    <div className="flex flex-col">
      <Hero profile={info} articleCount={articleCount} categoryCount={categoryList.length} tagCount={tagList.length} />

      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* 最新文章列表 */}
          {articleEnabled && (
            <section aria-labelledby="latest-articles">
              <div className="mb-5 flex items-center justify-between">
                <h2
                  id="latest-articles"
                  className="flex items-center gap-2 text-xl font-bold text-foreground"
                >
                  <Flame className="h-5 w-5 text-orange-500" aria-hidden="true" />
                  最新文章
                </h2>
                <Link
                  href="/articles"
                  className="flex items-center gap-1 rounded text-sm text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  查看更多
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>

              {latestArticles.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
                  暂无文章，快去后台发布第一篇吧
                </div>
              ) : (
                <div className="space-y-4">
                  {latestArticles.map((article) => (
                    <ArticleListItem key={article.id} article={article} />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* 侧边栏 */}
          <aside className="space-y-6">
            <ProfileCard
              profile={info}
              articleCount={articleCount}
              categoryCount={categoryList.length}
              tagCount={tagList.length}
            />

            {articleEnabled && (
              <>
                <SidebarCard
                  icon={<Tag className="h-4 w-4 text-primary" aria-hidden="true" />}
                  title="热门标签"
                  more={{ href: "/tags", label: "查看更多" }}
                >
                  {tagList.length === 0 ? (
                    <EmptyHint text="暂无标签" />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {tagList.slice(0, 12).map((tag) => (
                        <Link
                          key={tag.id}
                          href={`/articles?tag=${encodeURIComponent(tag.name)}`}
                          className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground transition-colors duration-200 hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          {tag.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </SidebarCard>

                <SidebarCard
                  icon={<Folder className="h-4 w-4 text-primary" aria-hidden="true" />}
                  title="分类目录"
                  more={{ href: "/categories", label: "查看更多" }}
                >
                  {categoryList.length === 0 ? (
                    <EmptyHint text="暂无分类" />
                  ) : (
                    <ul className="space-y-1">
                      {categoryList.map((category) => (
                        <li key={category.id}>
                          <Link
                            href={`/articles?category_id=${category.id}`}
                            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <FolderOpen className="h-4 w-4 shrink-0" aria-hidden="true" />
                            {category.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </SidebarCard>
              </>
            )}

            {/* 写作激励卡（固定深色，对应设计稿） */}
            <Link
              href="/about"
              className="group flex items-center gap-4 rounded-lg border border-white/10 bg-slate-900 p-5 transition-colors duration-200 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-white/20 font-mono text-sm text-white">
                <Terminal className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-white">坚持写作</span>
                <span className="mt-0.5 block truncate text-sm text-slate-400">
                  让技术沉淀为自己的成长
                </span>
              </span>
              <ArrowRight
                className="h-5 w-5 shrink-0 text-white transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}

/** Hero：博主配置的页面背景图 + 深色遮罩，未配置时回退网格渐变 */
function Hero({
  profile,
  articleCount,
  categoryCount,
  tagCount,
}: {
  profile: Blogger | null;
  articleCount: number;
  categoryCount: number;
  tagCount: number;
}) {
  const stats = [
    { icon: FileText, label: "文章", value: articleCount },
    { icon: Folder, label: "分类", value: categoryCount },
    { icon: Tag, label: "标签", value: tagCount },
  ];

  return (
    <section className="relative overflow-hidden bg-slate-900">
      {profile?.page_background ? (
        <>
          <Image
            src={profile.page_background}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/80 to-slate-900/50" />
        </>
      ) : (
        <div className="absolute inset-0">
          <div className="h-full w-full bg-[linear-gradient(rgba(96,165,250,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(96,165,250,0.08)_1px,transparent_1px)] bg-[size:2rem_2rem]" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/85 to-slate-900/60" />
        </div>
      )}

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
            你好，我是
            <span className="text-blue-400">{profile?.nickname || "技术开发者"}</span>
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-200/90 md:text-lg">
            {profile?.bio || profile?.blog_description || "记录学习、思考和实践的点滴，在技术的世界里持续成长。"}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/articles"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors duration-200 hover:bg-primary/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              浏览最新文章
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/about"
              className="inline-flex h-10 items-center rounded-lg border border-white/30 px-5 text-sm font-medium text-white transition-colors duration-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              关于我
            </Link>
          </div>

          <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-2 text-sm text-slate-300">
                <stat.icon className="h-4 w-4 text-blue-400" aria-hidden="true" />
                <dt>{stat.label}</dt>
                <dd className="font-semibold text-white">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function SidebarCard({
  icon,
  title,
  more,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  more?: { href: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
          {icon}
          {title}
        </h2>
        {more && (
          <Link
            href={more.href}
            className="flex items-center gap-0.5 rounded text-xs text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {more.label}
            <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

function EmptyHint({ text }: { text: string }) {
  return (
    <p className="rounded-md border border-dashed border-border py-4 text-center text-xs text-muted-foreground">
      {text}
    </p>
  );
}

function HomeSkeleton() {
  return (
    <div className="flex flex-col">
      <section className="bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <Skeleton className="h-10 w-72 max-w-full bg-white/10 md:h-14" />
          <Skeleton className="mt-4 h-5 w-full max-w-xl bg-white/10" />
          <div className="mt-8 flex gap-3">
            <Skeleton className="h-10 w-32 rounded-lg bg-white/10" />
            <Skeleton className="h-10 w-24 rounded-lg bg-white/10" />
          </div>
          <div className="mt-10 flex gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-5 w-20 bg-white/10" />
            ))}
          </div>
        </div>
      </section>
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-4">
            {Array.from({ length: LATEST_COUNT }).map((_, i) => (
              <Skeleton key={i} className="h-36 rounded-lg" />
            ))}
          </div>
          <div className="space-y-6">
            <Skeleton className="h-80 rounded-lg" />
            <Skeleton className="h-40 rounded-lg" />
            <Skeleton className="h-48 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
