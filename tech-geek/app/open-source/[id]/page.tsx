import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, GitFork, Star, Globe } from "lucide-react";
import { openSources, getModuleConfig, OpenSourceDetail } from "@/lib/api";
import { MarkdownRenderer } from "@/components/markdown-renderer";
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
  const config = await getModuleConfig();
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
    <div className="flex flex-1 flex-col">
      {/* 返回 */}
      <div className="mx-auto w-full max-w-5xl px-4 pt-8 sm:px-6 lg:px-8">
        <Link
          href="/open-source"
          className="inline-flex min-h-10 items-center gap-1.5 rounded-md text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          返回开源作品列表
        </Link>
      </div>

      {/* 标题信息 */}
      <header className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="flex items-center gap-3 font-mono text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              <GitFork className="h-7 w-7 shrink-0 text-muted-foreground" aria-hidden="true" />
              {project.name}
            </h1>
            {project.summary && (
              <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">
                {project.summary}
              </p>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              {project.language && (
                <span className="rounded-full border border-primary/30 bg-primary/5 px-2.5 py-0.5 text-xs font-medium text-primary">
                  {project.language}
                </span>
              )}
              {project.stars > 0 && (
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                  {project.stars} stars
                </span>
              )}
              {topics.map((topic) => (
                <span key={topic} className="rounded-full bg-muted px-2.5 py-0.5 text-xs">
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
                className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors duration-200 hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors duration-200 hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 lg:px-8 md:py-10">
        <section>
          <h2 className="mb-6 text-2xl font-bold text-foreground">README</h2>
          {project.readme ? (
            <MarkdownRenderer content={project.readme} />
          ) : (
            <p className="rounded-lg border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
              该项目暂无 README
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
