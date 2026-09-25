import { getModuleConfig } from "@/lib/api/module-config";
import { ModuleDisabled } from "@/components/ModuleDisabled";
import { MusicContent } from "@/components/MusicContent";

export const metadata = {
  title: "音乐分享",
};

export default async function MusicPage() {
  const config = await getModuleConfig();
  if (!config.music_enabled) {
    return <ModuleDisabled moduleLabel="音乐分享" />;
  }

  return <MusicContent />;
}
