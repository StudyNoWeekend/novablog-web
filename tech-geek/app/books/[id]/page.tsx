import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookOpen, CalendarDays } from "lucide-react";
import { books, getModuleConfig, BookDetail } from "@/lib/api";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { ModuleDisabled } from "@/components/module-disabled";
import { ReadingStatusBadge } from "@/components/book-card";
import { StarRating } from "@/components/star-rating";

interface PageProps {
  params: Promise<{ id: string }>;
}

// 后端不可达时的构建占位 id（output: export 不允许 generateStaticParams 返回空数组）；
// 该占位页渲染时不发任何请求，直接 404，保证构建不依赖后端可达（主题规范 3.4）
const FALLBACK_ID = "__fallback__";

export const dynamicParams = false;

export async function generateStaticParams() {
  try {
    const res = await books.list({ page: 1, page_size: 100 });
    if (res.list.length === 0) return [{ id: FALLBACK_ID }];
    return res.list.map((book) => ({ id: book.id }));
  } catch {
    return [{ id: FALLBACK_ID }];
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  if (id === FALLBACK_ID) {
    return { title: "书籍未找到" };
  }
  try {
    const book = await books.detail(id);
    return { title: book.title, description: `${book.title} · ${book.author}` };
  } catch {
    return { title: "书籍未找到" };
  }
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

  let book: BookDetail;
  try {
    book = await books.detail(id);
  } catch {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* 返回 */}
      <div className="mx-auto w-full max-w-5xl px-4 pt-8 sm:px-6 lg:px-8">
        <Link
          href="/books"
          className="inline-flex min-h-10 items-center gap-1.5 rounded-md text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          返回书架
        </Link>
      </div>

      {/* 封面 + 书籍信息 */}
      <header className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="relative aspect-[3/4] w-40 shrink-0 overflow-hidden rounded-lg bg-muted sm:w-48">
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
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-700 via-blue-900 to-slate-900">
                <BookOpen className="h-10 w-10 text-white/70" aria-hidden="true" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                {book.title}
              </h1>
              <ReadingStatusBadge status={book.reading_status} />
            </div>
            {book.author && (
              <p className="mt-2 text-base text-muted-foreground">{book.author}</p>
            )}
            {book.rating > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <StarRating value={book.rating} />
                <span className="text-sm text-muted-foreground">{book.rating.toFixed(1)} / 5</span>
              </div>
            )}
            {(book.started_at || book.finished_at) && (
              <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                {book.started_at && (
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="h-4 w-4" aria-hidden="true" />
                    开始 {book.started_at.slice(0, 10)}
                  </span>
                )}
                {book.finished_at && (
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="h-4 w-4" aria-hidden="true" />
                    读完 {book.finished_at.slice(0, 10)}
                  </span>
                )}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* 书评正文 */}
      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 lg:px-8 md:py-10">
        <section>
          <h2 className="mb-6 text-2xl font-bold text-foreground">书评</h2>
          {book.review ? (
            <MarkdownRenderer content={book.review} />
          ) : (
            <p className="rounded-lg border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
              暂无书评
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
