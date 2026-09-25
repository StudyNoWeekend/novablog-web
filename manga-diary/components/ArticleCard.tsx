import Image from "next/image";
import Link from "next/link";
import { Eye } from "lucide-react";
import { CatFace } from "@/components/ComicDoodle";
import { formatDate } from "@/lib/format";
import type { Article } from "@/lib/types";

/** 创作动态卡片：封面 + 分类印章 + 标题 + 标签 */
export function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group flex cursor-pointer flex-col"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-radius-md border border-border bg-background-soft shadow-card transition-shadow duration-300 ease-out group-hover:shadow-card-hover">
        {article.cover_image ? (
          <Image
            src={article.cover_image}
            alt={article.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-background-soft">
            <CatFace className="h-10 w-10 text-text-subtle" />
          </div>
        )}
        {article.category_name && (
          <span className="absolute left-3 top-3 rounded-full bg-ink/85 px-2.5 py-1 text-[11px] font-medium text-accent backdrop-blur-sm">
            {article.category_name}
          </span>
        )}
        {article.is_top && (
          <span className="absolute right-3 top-3 rounded-full bg-tomato px-2 py-0.5 text-[11px] font-medium text-white">
            置顶
          </span>
        )}
      </div>

      <h3 className="mt-3 line-clamp-1 font-display text-base text-text-primary transition-colors duration-200 group-hover:text-accent-hover">
        《{article.title}》
      </h3>
      <div className="mt-1.5 flex items-center gap-2 text-xs text-text-muted">
        {article.tag_names.length > 0 && (
          <span className="truncate">
            {article.tag_names.slice(0, 3).join(" / ")}
          </span>
        )}
        <span className="flex shrink-0 items-center gap-1">
          <Eye className="h-3 w-3" strokeWidth={1.5} />
          {article.view_count}
        </span>
      </div>
    </Link>
  );
}
