"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { getFileUrl } from "@/lib/api/client";
import type { Book } from "@/lib/types";

interface BookCardProps {
  book: Book;
}

/** 阅读状态 → 徽标文案 */
export const READING_STATUS_LABELS: Record<string, string> = {
  want: "想读",
  reading: "在读",
  done: "读完",
};

export function BookCard({ book }: BookCardProps) {
  const statusLabel = READING_STATUS_LABELS[book.reading_status];
  // 0-5 星，取整用于实心星展示
  const filledStars = Math.max(0, Math.min(5, Math.round(book.rating)));

  return (
    <Link
      href={`/books/${book.id}`}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-radius-md border border-border bg-surface shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:border-accent/40 hover:shadow-card-hover"
    >
      {/* 封面（书籍竖版比例） */}
      <div className="relative aspect-[2/3] overflow-hidden">
        {book.cover ? (
          <Image
            src={getFileUrl(book.cover)}
            alt={book.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-surface-elevated to-background-soft text-text-subtle">
            <span className="text-sm">暂无封面</span>
          </div>
        )}
        {statusLabel && (
          <span className="absolute left-3 top-3 rounded-full bg-gradient-theme px-2.5 py-0.5 text-xs font-bold text-white shadow-glow">
            {statusLabel}
          </span>
        )}
      </div>

      {/* 信息 */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 font-heading text-base font-bold leading-snug text-text-primary transition-colors duration-200 ease-out group-hover:text-accent-hover">
          {book.title}
        </h3>
        {book.author && (
          <p className="mt-1.5 truncate text-sm text-text-muted">{book.author}</p>
        )}
        {book.rating > 0 && (
          <div className="mt-2 flex items-center gap-0.5" aria-label={`评分 ${book.rating} 星`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < filledStars ? "fill-accent-2 text-accent-2" : "text-text-subtle"
                }`}
                strokeWidth={1.5}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
