"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookOpen, CalendarDays } from "lucide-react";
import type { BookDetail } from "@/lib/api";
import { MarkdownContent } from "./markdown-content";
import { ReadingStatusBadge } from "./book-card";
import { StarRating } from "./star-rating";

interface BookDetailPageProps {
  book: BookDetail;
}

export function BookDetailPage({ book }: BookDetailPageProps) {
  return (
    <article className="bg-background">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-16 lg:py-20">
        <Link
          href="/books"
          className="inline-flex items-center gap-1.5 rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
        >
          <ArrowLeft className="size-4" />
          返回书架
        </Link>

        <header className="mt-8 flex flex-col gap-8 sm:flex-row">
          <div className="relative aspect-[3/4] w-40 shrink-0 overflow-hidden rounded-xl bg-muted sm:w-48">
            {book.cover ? (
              <Image
                src={book.cover}
                alt={book.title}
                fill
                priority
                sizes="(max-width: 640px) 160px, 192px"
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                <BookOpen className="size-10" aria-hidden="true" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start gap-3">
              <h1 className="font-heading text-3xl font-normal leading-tight text-foreground md:text-4xl">
                {book.title}
              </h1>
              <ReadingStatusBadge status={book.reading_status} />
            </div>
            {book.author && (
              <p className="mt-2 text-base text-muted-foreground">{book.author}</p>
            )}
            {book.rating > 0 && (
              <div className="mt-4 flex items-center gap-2.5">
                <StarRating value={book.rating} />
                <span className="text-sm text-muted-foreground">{book.rating.toFixed(1)} / 5</span>
              </div>
            )}
            {(book.started_at || book.finished_at) && (
              <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                {book.started_at && (
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="size-4" aria-hidden="true" />
                    开始 {book.started_at.slice(0, 10)}
                  </span>
                )}
                {book.finished_at && (
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="size-4" aria-hidden="true" />
                    读完 {book.finished_at.slice(0, 10)}
                  </span>
                )}
              </p>
            )}
          </div>
        </header>

        <section className="mt-12">
          <h2 className="mb-6 font-heading text-2xl font-medium text-foreground">书评</h2>
          {book.review ? (
            <MarkdownContent content={book.review} />
          ) : (
            <p className="rounded-2xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
              暂无书评
            </p>
          )}
        </section>
      </div>
    </article>
  );
}
