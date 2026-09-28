import { Suspense } from "react";
import type { Metadata } from "next";
import { BooksListContent } from "@/components/BooksListContent";
import { ModuleDisabled } from "@/components/ModuleDisabled";
import { PageHeader } from "@/components/PageHeader";
import { getModuleConfig } from "@/lib/api/module-config";

export const metadata: Metadata = {
  title: "读书书架",
  description: "读书书架：想读的、在读的与读完的书都摆在这里",
};

export default async function BooksPage() {
  const config = await getModuleConfig();
  if (!config.book_enabled) {
    return <ModuleDisabled moduleLabel="读书书架" />;
  }

  return (
    <div className="flex flex-1 flex-col bg-background">
      <PageHeader
        title="读书书架"
        subtitle="拍完视频也要读读书，书页间的灵感常常比取景框更宽"
      />
      <Suspense
        fallback={
          <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-72 animate-pulse rounded-xl bg-surface"
                />
              ))}
            </div>
          </div>
        }
      >
        <BooksListContent />
      </Suspense>
    </div>
  );
}
