import type { Metadata } from "next";
import { Suspense } from "react";
import { ArticlesListPage } from "@/components/articles-list-page";
import { ArticleGridSkeleton } from "@/components/loading";

export const metadata: Metadata = {
  title: "文章",
  description: "阅读摄影技巧、创作心得与视觉故事。",
};

export default function Page() {
  return (
    <Suspense fallback={<ArticleGridSkeleton count={9} />}>
      <ArticlesListPage />
    </Suspense>
  );
}
