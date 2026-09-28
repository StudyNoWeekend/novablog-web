import Link from "next/link";
import { GitFork, Star } from "lucide-react";
import type { OpenSource } from "@/lib/api";

/** 话题标签字符串拆分为数组（后端返回逗号分隔，如 "go,cli,tools"） */
export function splitTopics(topics?: string): string[] {
  return String(topics ?? "")
    .split(",")
    .map((topic) => topic.trim())
    .filter(Boolean);
}

/** 开源作品卡片：仓库名 + 简介 + 语言/话题标签 + Star 数 */
export function OpenSourceCard({ project }: { project: OpenSource }) {
  const topics = splitTopics(project.topics);

  return (
    <article className="group card-lift flex cursor-pointer flex-col rounded-2xl border border-border bg-card p-5 focus-within:ring-2 focus-within:ring-ring">
      <div className="flex items-start justify-between gap-3">
        <h3 className="flex min-w-0 items-center gap-2 text-base font-semibold text-foreground">
          <GitFork className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <Link
            href={`/open-source/${project.id}`}
            className="truncate rounded transition-colors group-hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
          >
            {project.name}
          </Link>
        </h3>
        {project.stars > 0 && (
          <span
            className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground"
            aria-label={`${project.stars} stars`}
          >
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
            {project.stars}
          </span>
        )}
      </div>

      {project.summary && (
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {project.summary}
        </p>
      )}

      {(project.language || topics.length > 0) && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {project.language && (
            <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
              {project.language}
            </span>
          )}
          {topics.map((topic) => (
            <span
              key={topic}
              className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
            >
              #{topic}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
