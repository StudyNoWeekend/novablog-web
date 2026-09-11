import type { Metadata } from "next";
import { Suspense } from "react";
import { PortfoliosListPage } from "@/components/portfolios-list-page";
import { PortfolioGridSkeleton } from "@/components/loading";

export const metadata: Metadata = {
  title: "作品集",
  description: "浏览摄影作品集，按分类筛选最新创作。",
};

export default function Page() {
  return (
    <Suspense fallback={<PortfolioGridSkeleton count={9} />}>
      <PortfoliosListPage />
    </Suspense>
  );
}
