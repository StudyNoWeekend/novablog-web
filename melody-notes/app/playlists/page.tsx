import { getModuleConfig } from "@/lib/api/module-config";
import { ModuleDisabled } from "@/components/ModuleDisabled";
import { PlaylistsContent } from "@/components/PlaylistsContent";

export const metadata = { title: "歌单" };

export default async function PlaylistsPage() {
  const config = await getModuleConfig();
  if (!config.music_enabled) {
    return <ModuleDisabled moduleLabel="音乐" />;
  }
  return <PlaylistsContent />;
}
