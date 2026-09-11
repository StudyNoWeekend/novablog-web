import { getModuleConfig } from "@/lib/api/module-config";
import { ModuleDisabled } from "@/components/ModuleDisabled";
import { MusicContent } from "@/components/MusicContent";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "音乐分享",
  description: "写代码、修图、赶路时陪伴我的旋律。",
};

export default async function MusicPage() {
  const config = await getModuleConfig();
  if (!config.music_enabled) {
    return <ModuleDisabled moduleLabel="音乐" />;
  }

  return <MusicContent />;
}
