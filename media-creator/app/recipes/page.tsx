import { Suspense } from "react";
import { RecipesContent } from "./recipes-content";
import { ModuleDisabled } from "@/components/module-disabled";
import { ListSkeleton } from "@/components/list-skeleton";
import { moduleConfig, ALL_ENABLED } from "@/lib/api";

export const metadata = { title: "美食菜谱" };

export default async function RecipesPage() {
  const modules = await moduleConfig.get().catch(() => ALL_ENABLED);
  if (!modules.recipe_enabled) {
    return <ModuleDisabled moduleLabel="美食菜谱" />;
  }
  return (
    <Suspense fallback={<ListSkeleton />}>
      <RecipesContent />
    </Suspense>
  );
}
