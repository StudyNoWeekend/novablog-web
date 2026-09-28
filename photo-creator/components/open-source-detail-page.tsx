"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink, GitFork, Globe, Star } from "lucide-react";
import type { OpenSourceDetail } from "@/lib/api";
import { MarkdownContent } from "./markdown-content";
import { splitTopics } from "./open-source-card";

interface OpenSourceDetailPageProps {
  project: OpenSourceDetail;
}

/** 外链安全校验：仅放行 http(s) 与站点相对路径，其余返回 null 不渲染链接 */
function safeExternalUrl(url?: string | null): string | null {
  const value = String(url ?? "").trim();
  if (/^(https?:\/\/|\/)/i.test(value)) return value;
  return null;
}

export function OpenSourceDetailPage({ project }: OpenSourceDetailPageProps) {
  const topics = splitTopics(project.topics);
  const repoUrl = safeExternalUrl(project.repo_url);
  const homepageUrl = safeExternalUrl(project.homepage);

  return (
    <article className="bg-background">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-16 lg:py-20">
        <Link
          href="/open-source"
          className="inline-flex items-center gap-1.5 rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          返回开源作品
        </Link>

        <header className="mt-8">
          <h1 className="flex items-center gap-3 font-heading text-3xl font-normal leading-tight text-foreground md:text-4xl lg:text-5xl">
            <GitFork className="size-7 shrink-0 text-muted-foreground" aria-hidden="true" />
            {project.name}
          </h1>
          {project.summary && (
            <p className="mt-6 border-l-2 border-primary pl-5 text-lg italic leading-relaxed text-muted-foreground">
              {project.summary}
            </p>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            {project.language && (
              <span className="rounded-full border border-primary/30 bg-primary/5 px-2.5 py-1 text-xs text-primary">
                {project.language}
              </span>
            )}
            {project.stars > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <Star className="size-4 fill-primary text-primary" aria-hidden="true" />
                {project.stars} stars
              </span>
            )}
            {topics.map((topic) => (
              <span key={topic} className="rounded-full bg-muted px-2.5 py-1 text-xs">
                #{topic}
              </span>
            ))}
          </div>

          {(repoUrl || homepageUrl) && (
            <div className="mt-6 flex flex-wrap gap-3">
              {repoUrl && (
                <a
                  href={repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-5 py-2 text-sm text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <GitFork className="size-4" aria-hidden="true" />
                  仓库
                  <ExternalLink className="size-3.5 text-muted-foreground" aria-hidden="true" />
                </a>
              )}
              {homepageUrl && (
                <a
                  href={homepageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-5 py-2 text-sm text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Globe className="size-4" aria-hidden="true" />
                  主页
                  <ExternalLink className="size-3.5 text-muted-foreground" aria-hidden="true" />
                </a>
              )}
            </div>
          )}
        </header>

        <section className="mt-12">
          <h2 className="mb-6 font-heading text-2xl font-medium text-foreground">README</h2>
          {project.readme ? (
            <MarkdownContent content={project.readme} />
          ) : (
            <p className="rounded-2xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
              该项目暂无 README
            </p>
          )}
        </section>
      </div>
    </article>
  );
}
