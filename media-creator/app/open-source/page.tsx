import { Suspense } from "react";
import { OpenSourceContent } from "./open-source-content";
import { ModuleDisabled } from "@/components/module-disabled";
import { ListSkeleton } from "@/components/list-skeleton";
import { moduleConfig, ALL_ENABLED } from "@/lib/api";

export const metadata = { title: "开源作品" };

export default async function OpenSourcePage() {
  const modules = await moduleConfig.get().catch(() => ALL_ENABLED);
  if (!modules.open_source_enabled) {
    return <ModuleDisabled moduleLabel="开源作品" />;
  }
  return (
    <Suspense fallback={<ListSkeleton />}>
      <OpenSourceContent />
    </Suspense>
  );
}
