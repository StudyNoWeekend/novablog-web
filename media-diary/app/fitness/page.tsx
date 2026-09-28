import { Suspense } from "react";
import type { Metadata } from "next";
import { FitnessListContent } from "@/components/FitnessListContent";
import { ModuleDisabled } from "@/components/ModuleDisabled";
import { PageHeader } from "@/components/PageHeader";
import { getModuleConfig } from "@/lib/api/module-config";

export const metadata: Metadata = {
  title: "健身训练",
  description: "健身训练：力量、有氧与拉伸的每一次记录",
};

export default async function FitnessPage() {
  const config = await getModuleConfig();
  if (!config.fitness_enabled) {
    return <ModuleDisabled moduleLabel="健身训练" />;
  }

  return (
    <div className="flex flex-1 flex-col bg-background">
      <PageHeader
        title="健身训练"
        subtitle="对着镜头讲了一天的故事，也要留点时间给自己流流汗"
      />
      <Suspense
        fallback={
          <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-44 animate-pulse rounded-xl bg-surface"
                />
              ))}
            </div>
          </div>
        }
      >
        <FitnessListContent />
      </Suspense>
    </div>
  );
}
