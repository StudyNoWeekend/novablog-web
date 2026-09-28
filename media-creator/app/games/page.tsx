import { Suspense } from "react";
import { GamesContent } from "./games-content";
import { ModuleDisabled } from "@/components/module-disabled";
import { ListSkeleton } from "@/components/list-skeleton";
import { moduleConfig, ALL_ENABLED } from "@/lib/api";

export const metadata = { title: "游戏库" };

export default async function GamesPage() {
  const modules = await moduleConfig.get().catch(() => ALL_ENABLED);
  if (!modules.game_enabled) {
    return <ModuleDisabled moduleLabel="游戏库" />;
  }
  return (
    <Suspense fallback={<ListSkeleton />}>
      <GamesContent />
    </Suspense>
  );
}
