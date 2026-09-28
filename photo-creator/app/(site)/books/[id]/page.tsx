import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { books, getModuleConfig, type BookDetail } from "@/lib/api";
import { BookDetailPage } from "@/components/book-detail-page";
import { ModuleDisabled } from "@/components/module-disabled";

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
    if (!res.list.length) return [{ id: FALLBACK_ID }];
    return res.list.map((book) => ({ id: book.id }));
  } catch {
    return [{ id: FALLBACK_ID }];
  }
}

async function fetchBook(id: string): Promise<BookDetail | null> {
  try {
    return await books.detail(id);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  if (id === FALLBACK_ID) {
    return { title: "书籍未找到" };
  }
  const data = await fetchBook(id);
  if (!data) return { title: "读书书架" };
  return {
    title: data.title,
    description: `${data.title} · ${data.author}`,
    openGraph: {
      title: data.title,
      description: `${data.title} · ${data.author}`,
      images: data.cover ? [data.cover] : undefined,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const config = await getModuleConfig();
  if (!config.book_enabled) {
    return <ModuleDisabled moduleLabel="读书书架" />;
  }

  const { id } = await params;
  if (id === FALLBACK_ID) {
    notFound();
  }
  const data = await fetchBook(id);
  if (!data) notFound();
  return <BookDetailPage book={data} />;
}
