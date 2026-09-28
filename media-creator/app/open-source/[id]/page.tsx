import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, GitFork, Globe, Star } from "lucide-react";
import { openSources, moduleConfig, ALL_ENABLED, type OpenSourceDetail } from "@/lib/api";
import { MarkdownContent } from "@/components/markdown-content";
import { ModuleDisabled } from "@/components/module-disabled";
import { splitTopics } from "@/components/open-source-card";

interface PageProps {
  params: Promise<{ id: string }>;
}

// 后端不可达时的构建占位 id（output: export 不允许 generateStaticParams 返回空数组）；
// 该占位页渲染时不发任何请求，直接 404，保证构建不依赖后端可达（主题规范 3.4）
const FALLBACK_ID = "__fallback__";

export const dynamicParams = false;

export async function generateStaticParams() {
  try {
    const res = await openSources.list({ page: 1, page_size: 100 });
    if (res.list.length === 0) return [{ id: FALLBACK_ID }];
    return res.list.map((project) => ({ id: project.id }));
  } catch {
    return [{ id: FALLBACK_ID }];
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  if (id === FALLBACK_ID) {
    return { title: "项目未找到" };
  }
  try {
    const project = await openSources.detail(id);
    return { title: project.name, description: project.summary };
  } catch {
    return { title: "项目未找到" };
  }
}

/** 外链安全校验：仅放行 http(s) 与站点相对路径，其余返回 null 不渲染链接 */
function safeExternalUrl(url?: string | null): string | null {
  const value = String(url ?? "").trim();
  if (/^(https?:\/\/|\/)/i.test(value)) return value;
  return null;
}

export default async function OpenSourceDetailPage({ params }: PageProps) {
  const config = await moduleConfig.get().catch(() => ALL_ENABLED);
  if (!config.open_source_enabled) {
    return <ModuleDisabled moduleLabel="开源作品" />;
  }

  const { id } = await params;
  if (id === FALLBACK_ID) {
    notFound();
  }

  let project: OpenSourceDetail;
  try {
    project = await openSources.detail(id);
  } catch {
    notFound();
  }

  const topics = splitTopics(project.topics);
  const repoUrl = safeExternalUrl(project.repo_url);
  const homepageUrl = safeExternalUrl(project.homepage);

  return (
    <div className="min-h-screen py-10 lg:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/open-source"
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft className="h-4 w-4" />
          返回开源作品列表
        </Link>

        {/* 标题信息 */}
        <header className="mt-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="flex items-center gap-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                <GitFork className="h-7 w-7 shrink-0 text-muted-foreground" aria-hidden="true" />
                {project.name}
              </h1>
              {project.summary && (
                <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
                  {project.summary}
                </p>
              )}
              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
                {project.language && (
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                    {project.language}
                  </span>
                )}
                {project.stars > 0 && (
                  <span className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                    {project.stars} stars
                  </span>
                )}
                {topics.map((topic) => (
                  <span
                    key={topic}
                    className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium"
                  >
                    #{topic}
                  </span>
                ))}
              </div>
            </div>

            {/* 仓库与主页外链 */}
            <div className="flex shrink-0 flex-wrap gap-3">
              {repoUrl && (
                <a
                  href={repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-card px-5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <GitFork className="h-4 w-4" aria-hidden="true" />
                  仓库
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                </a>
              )}
              {homepageUrl && (
                <a
                  href={homepageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-card px-5 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Globe className="h-4 w-4" aria-hidden="true" />
                  主页
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        </header>

        {/* README 正文 */}
        <section className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8 lg:p-10">
          <h2 className="mb-6 font-hand text-2xl text-foreground">README</h2>
          {project.readme ? (
            <MarkdownContent content={project.readme} />
          ) : (
            <p className="rounded-xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
              该项目暂无 README
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
