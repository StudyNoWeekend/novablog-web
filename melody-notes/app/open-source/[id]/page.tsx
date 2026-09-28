import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, GitBranch, Star } from "lucide-react";
import { getOpenSources, getOpenSourceById } from "@/lib/api/open-sources";
import { getModuleConfig } from "@/lib/api/module-config";
import { OpenSourceCard } from "@/components/OpenSourceCard";
import { MarkdownContent } from "@/components/MarkdownContent";
import { ModuleDisabled } from "@/components/ModuleDisabled";

interface PageProps {
  params: Promise<{ id: string }>;
}

// 后端不可达时的构建占位 id（output: export 不允许 generateStaticParams 返回空数组）；
// 该占位页渲染时不发任何请求，直接 404，保证构建不依赖后端可达（主题规范 3.4）
const FALLBACK_ID = "__fallback__";

export const dynamicParams = false;

export async function generateStaticParams() {
  const res = await getOpenSources({ page: 1, page_size: 100 });
  if (res.list.length === 0) return [{ id: FALLBACK_ID }];
  return res.list.map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  if (id === FALLBACK_ID) {
    return { title: "开源作品未找到" };
  }
  const detail = await getOpenSourceById(id);
  if (!detail) return { title: "开源作品未找到" };
  return {
    title: detail.name,
    description: detail.summary || undefined,
  };
}

export default async function OpenSourceDetailPage({ params }: PageProps) {
  const config = await getModuleConfig();
  if (!config.open_source_enabled) {
    return <ModuleDisabled moduleLabel="开源作品" />;
  }

  const { id } = await params;
  if (id === FALLBACK_ID) {
    notFound();
  }
  const detail = await getOpenSourceById(id);
  if (!detail) {
    notFound();
  }

  const topics = String(detail.topics || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const moreItems = (await getOpenSources({ page: 1, page_size: 100 })).list
    .filter((item) => item.id !== detail.id)
    .slice(0, 3);

  return (
    <div className="flex flex-1 flex-col">
      {/* Back link */}
      <div className="mx-auto w-full max-w-5xl px-4 pt-8 sm:px-6 lg:px-8">
        <Link
          href="/open-source"
          className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 text-sm text-text-muted transition-colors duration-200 hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          返回开源作品列表
        </Link>
      </div>

      {/* Content */}
      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 lg:px-8 md:py-10">
        {/* 标题 + Star 数 */}
        <header>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-3xl font-bold leading-tight text-text-primary md:text-4xl">
              {detail.name}
            </h1>
            {detail.stars > 0 && (
              <span className="flex items-center gap-1.5 text-sm text-text-muted">
                <Star className="h-4 w-4 fill-accent text-accent" strokeWidth={1.5} />
                {detail.stars.toLocaleString()} Stars
              </span>
            )}
          </div>

          {/* 语言 + topics 标签 */}
          {(detail.language || topics.length > 0) && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {detail.language && (
                <span className="rounded-full bg-accent-subtle px-3 py-1 text-xs font-medium text-accent">
                  {detail.language}
                </span>
              )}
              {topics.map((topic) => (
                <span
                  key={topic}
                  className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-text-muted"
                >
                  {topic}
                </span>
              ))}
            </div>
          )}

          {/* 简介 */}
          {detail.summary && (
            <blockquote className="mt-8 border-l-2 border-accent pl-4 text-base italic leading-relaxed text-text-muted md:pl-5">
              {detail.summary}
            </blockquote>
          )}

          {/* 仓库与主页外链 */}
          <div className="mt-6 flex flex-wrap gap-3">
            {detail.repo_url && (
              <a
                href={detail.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-accent-strong px-5 text-sm font-medium text-on-accent transition-colors duration-200 ease-out hover:bg-accent-hover"
              >
                <GitBranch className="h-4 w-4" strokeWidth={1.5} />
                仓库地址
              </a>
            )}
            {detail.homepage && (
              <a
                href={detail.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-border bg-surface px-5 text-sm font-medium text-text-secondary transition-colors duration-200 ease-out hover:border-accent hover:text-accent"
              >
                <ExternalLink className="h-4 w-4" strokeWidth={1.5} />
                项目主页
              </a>
            )}
          </div>
        </header>

        {/* README（Markdown 渲染） */}
        {detail.readme && (
          <article className="mt-10 border-t border-border pt-10">
            <h2 className="mb-6 text-2xl font-bold text-text-primary">README</h2>
            <MarkdownContent content={detail.readme} />
          </article>
        )}
      </div>

      {/* 更多开源作品 */}
      {moreItems.length > 0 && (
        <section className="border-t border-border bg-background-soft py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-2xl font-bold text-text-primary">
              更多开源作品
              <span className="ml-3 align-middle text-sm font-normal text-text-muted">
                都是我折腾过的痕迹。
              </span>
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {moreItems.map((item) => (
                <OpenSourceCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
