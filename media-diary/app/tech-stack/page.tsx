import { Suspense } from "react";
import type { Metadata } from "next";
import { TechStackListContent } from "@/components/TechStackListContent";
import { ModuleDisabled } from "@/components/ModuleDisabled";
import { PageHeader } from "@/components/PageHeader";
import { getModuleConfig } from "@/lib/api/module-config";

export const metadata: Metadata = {
  title: "技术栈",
  description: "技术栈：剪辑、搭建与折腾过的一切工具箱",
};

export default async function TechStackPage() {
  const config = await getModuleConfig();
  if (!config.tech_stack_enabled) {
    return <ModuleDisabled moduleLabel="技术栈" />;
  }

  return (
    <div className="flex flex-1 flex-col bg-background">
      <PageHeader
        title="技术栈"
        subtitle="从剪辑软件到建站框架，创作背后的工具箱全在这里"
      />
      <Suspense
        fallback={
          <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-52 animate-pulse rounded-xl bg-surface"
                />
              ))}
            </div>
          </div>
        }
      >
        <TechStackListContent />
      </Suspense>
    </div>
  );
}
