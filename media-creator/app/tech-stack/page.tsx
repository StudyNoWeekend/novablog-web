import { Suspense } from "react";
import { TechStackContent } from "./tech-stack-content";
import { ModuleDisabled } from "@/components/module-disabled";
import { ListSkeleton } from "@/components/list-skeleton";
import { moduleConfig, ALL_ENABLED } from "@/lib/api";

export const metadata = { title: "技术栈" };

export default async function TechStackPage() {
  const modules = await moduleConfig.get().catch(() => ALL_ENABLED);
  if (!modules.tech_stack_enabled) {
    return <ModuleDisabled moduleLabel="技术栈" />;
  }
  return (
    <Suspense fallback={<ListSkeleton />}>
      <TechStackContent />
    </Suspense>
  );
}
