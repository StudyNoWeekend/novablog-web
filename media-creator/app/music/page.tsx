import { Suspense } from "react";
import { MusicContent } from "./music-content";
import { ModuleDisabled } from "@/components/module-disabled";
import { moduleConfig, ALL_ENABLED } from "@/lib/api";

export const metadata = { title: "音乐" };

export default async function MusicPage() {
  const modules = await moduleConfig.get().catch(() => ALL_ENABLED);
  if (!modules.music_enabled) {
    return <ModuleDisabled moduleLabel="音乐" />;
  }
  return (
    <Suspense fallback={<MusicSkeleton />}>
      <MusicContent />
    </Suspense>
  );
}

function MusicSkeleton() {
  return (
    <div className="min-h-screen py-10 lg:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="h-9 w-40 animate-pulse rounded-xl bg-muted" />
        <div className="mt-8 overflow-hidden rounded-2xl border border-border">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 border-b border-border px-4 py-3 last:border-b-0"
            >
              <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
                <div className="h-3 w-1/5 animate-pulse rounded bg-muted" />
              </div>
              <div className="h-3 w-10 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
