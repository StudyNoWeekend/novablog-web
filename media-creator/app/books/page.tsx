import { Suspense } from "react";
import { BooksContent } from "./books-content";
import { ModuleDisabled } from "@/components/module-disabled";
import { ListSkeleton } from "@/components/list-skeleton";
import { moduleConfig, ALL_ENABLED } from "@/lib/api";

export const metadata = { title: "读书书架" };

export default async function BooksPage() {
  const modules = await moduleConfig.get().catch(() => ALL_ENABLED);
  if (!modules.book_enabled) {
    return <ModuleDisabled moduleLabel="读书书架" />;
  }
  return (
    <Suspense fallback={<ListSkeleton variant="row" count={4} />}>
      <BooksContent />
    </Suspense>
  );
}
