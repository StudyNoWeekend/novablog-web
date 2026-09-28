import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
import { getBooks, getBookById } from "@/lib/api/books";
import { getModuleConfig } from "@/lib/api/module-config";
import { BookCard, READING_STATUS_LABELS } from "@/components/BookCard";
import { MarkdownContent } from "@/components/MarkdownContent";
import { ModuleDisabled } from "@/components/ModuleDisabled";
import type { Book } from "@/lib/types";

interface PageProps {
  params: Promise<{ id: string }>;
}

// 后端不可达时的构建占位 id（output: export 不允许 generateStaticParams 返回空数组）；
// 该占位页渲染时不发任何请求，直接 404，保证构建不依赖后端可达（主题规范 3.4）
const FALLBACK_ID = "__fallback__";

export const dynamicParams = false;

export async function generateStaticParams() {
  const res = await getBooks({ page: 1, page_size: 100 });
  if (res.list.length === 0) return [{ id: FALLBACK_ID }];
  return res.list.map((book) => ({ id: book.id }));
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  if (id === FALLBACK_ID) {
    return { title: "书籍未找到" };
  }
  const book = await getBookById(id);
  if (!book) return { title: "书籍未找到" };
  return {
    title: book.title,
    description: book.author || undefined,
  };
}

/** 日期格式化（无效日期返回空串） */
function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** 书籍封面（列表/详情复用，failover 占位由调用处处理） */
function CoverImage({ book }: { book: Book }) {
  return book.cover ? (
    <Image
      src={book.cover}
      alt={book.title}
      width={480}
      height={720}
      priority
      sizes="(max-width: 640px) 60vw, 240px"
      className="h-auto w-full rounded-radius-md object-cover shadow-card"
      referrerPolicy="no-referrer"
    />
  ) : (
    <div className="flex aspect-[2/3] w-full items-center justify-center rounded-radius-md bg-background-soft text-sm text-text-subtle">
      暂无封面
    </div>
  );
}

export default async function BookDetailPage({ params }: PageProps) {
  const config = await getModuleConfig();
  if (!config.book_enabled) {
    return <ModuleDisabled moduleLabel="读书书架" />;
  }

  const { id } = await params;
  if (id === FALLBACK_ID) {
    notFound();
  }
  const book = await getBookById(id);
  if (!book) {
    notFound();
  }

  const statusLabel = READING_STATUS_LABELS[book.reading_status];
  const filledStars = Math.max(0, Math.min(5, Math.round(book.rating)));
  const startedAt = formatDate(book.started_at);
  const finishedAt = formatDate(book.finished_at);

  const moreBooks = (await getBooks({ page: 1, page_size: 100 })).list
    .filter((item) => item.id !== book.id)
    .slice(0, 4);

  return (
    <div className="flex flex-1 flex-col bg-background">
      {/* Back link */}
      <div className="mx-auto w-full max-w-5xl px-4 pt-8 sm:px-6 lg:px-8">
        <Link
          href="/books"
          className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 text-sm text-text-muted transition-colors duration-200 hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          返回书架
        </Link>
      </div>

      {/* 封面 + 信息 */}
      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 lg:px-8 md:py-10">
        <div className="flex flex-col gap-8 sm:flex-row">
          {/* 封面 */}
          <div className="w-44 shrink-0 sm:w-52">
            <CoverImage book={book} />
          </div>

          {/* 信息 */}
          <div className="min-w-0 flex-1">
            {statusLabel && (
              <span className="mb-3 inline-block rounded-full bg-accent px-3 py-1 text-xs font-medium text-background">
                {statusLabel}
              </span>
            )}
            <h1 className="font-[var(--font-playfair)] text-3xl font-bold leading-tight text-text-primary md:text-4xl">
              {book.title}
            </h1>
            {book.author && (
              <p className="mt-3 text-base text-text-muted">{book.author}</p>
            )}
            {book.rating > 0 && (
              <div
                className="mt-4 flex items-center gap-1"
                aria-label={`评分 ${book.rating} 星`}
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4.5 w-4.5 ${
                      i < filledStars ? "fill-accent text-accent" : "text-text-subtle"
                    }`}
                    strokeWidth={1.5}
                  />
                ))}
                <span className="ml-2 text-sm text-text-muted">{book.rating} / 5</span>
              </div>
            )}
            {(startedAt || finishedAt) && (
              <div className="mt-4 space-y-1 text-sm text-text-muted">
                {startedAt && <p>开始阅读：{startedAt}</p>}
                {finishedAt && <p>读完于：{finishedAt}</p>}
              </div>
            )}
          </div>
        </div>

        {/* 书评（Markdown 渲染） */}
        <article className="mt-10 border-t border-border pt-10">
          <h2 className="mb-6 font-[var(--font-playfair)] text-2xl font-bold text-text-primary">
            书评
          </h2>
          {book.review ? (
            <MarkdownContent content={book.review} />
          ) : (
            <p className="text-sm text-text-muted">暂无书评</p>
          )}
        </article>
      </div>

      {/* 更多书籍 */}
      {moreBooks.length > 0 && (
        <section className="border-t border-border bg-background-soft py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 font-[var(--font-playfair)] text-2xl font-bold text-text-primary">
              更多书籍
            </h2>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {moreBooks.map((item) => (
                <BookCard key={item.id} book={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
