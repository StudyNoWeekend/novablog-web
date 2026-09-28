import Link from "next/link";
import Image from "next/image";
import { BookOpen } from "lucide-react";
import type { Book } from "@/lib/api";
import { StarRating } from "./star-rating";

/** 阅读状态映射：want=想读 reading=在读 done=读完（低饱和徽标区分） */
export const READING_STATUS_META: Record<string, { label: string; className: string }> = {
  want: {
    label: "想读",
    className: "border-sky-700/25 bg-sky-700/10 text-sky-800 dark:text-sky-300",
  },
  reading: {
    label: "在读",
    className: "border-emerald-700/25 bg-emerald-700/10 text-emerald-800 dark:text-emerald-300",
  },
  done: {
    label: "读完",
    className: "border-primary/40 bg-primary/10 text-primary",
  },
};

/** 阅读状态徽标（未知状态不渲染） */
export function ReadingStatusBadge({ status }: { status: string }) {
  const meta = READING_STATUS_META[status];
  if (!meta) return null;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${meta.className}`}
    >
      {meta.label}
    </span>
  );
}

/** 读书卡片：竖版封面 + 书名 + 作者 + 星级 + 阅读状态徽标 */
export function BookCard({ book }: { book: Book }) {
  return (
    <article className="group flex gap-5 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40 focus-within:ring-2 focus-within:ring-ring">
      <Link
        href={`/books/${book.id}`}
        className="relative block aspect-[3/4] w-20 shrink-0 overflow-hidden rounded-lg bg-muted sm:w-24"
        aria-label={book.title}
      >
        {book.cover ? (
          <Image
            src={book.cover}
            alt={book.title}
            fill
            sizes="(max-width: 640px) 80px, 96px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <BookOpen className="size-7" aria-hidden="true" />
          </div>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading text-lg font-medium leading-snug text-foreground">
            <Link
              href={`/books/${book.id}`}
              className="rounded transition-colors group-hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
            >
              {book.title}
            </Link>
          </h3>
          <ReadingStatusBadge status={book.reading_status} />
        </div>

        {book.author && (
          <p className="mt-1 truncate text-sm text-muted-foreground">{book.author}</p>
        )}

        {book.rating > 0 && (
          <div className="mt-auto pt-3">
            <StarRating value={book.rating} />
          </div>
        )}
      </div>
    </article>
  );
}
