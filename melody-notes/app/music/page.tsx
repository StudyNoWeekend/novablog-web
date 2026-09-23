import { getModuleConfig } from "@/lib/api/module-config";
import { ModuleDisabled } from "@/components/ModuleDisabled";
import { MusicPageContent } from "@/components/MusicPageContent";

export const metadata = { title: "音乐推荐" };

export default async function MusicPage() {
  const config = await getModuleConfig();
  if (!config.music_enabled) {
    return <ModuleDisabled moduleLabel="音乐" />;
  }
  return <MusicPageContent />;
}
