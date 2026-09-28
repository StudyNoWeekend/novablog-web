import { Suspense } from "react";
import { FitnessContent } from "./fitness-content";
import { ModuleDisabled } from "@/components/module-disabled";
import { ListSkeleton } from "@/components/list-skeleton";
import { moduleConfig, ALL_ENABLED } from "@/lib/api";

export const metadata = { title: "健身训练" };

export default async function FitnessPage() {
  const modules = await moduleConfig.get().catch(() => ALL_ENABLED);
  if (!modules.fitness_enabled) {
    return <ModuleDisabled moduleLabel="健身训练" />;
  }
  return (
    <Suspense fallback={<ListSkeleton variant="row" count={6} />}>
      <FitnessContent />
    </Suspense>
  );
}
