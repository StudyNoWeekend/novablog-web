import type { Metadata } from "next";
import { MusicContent } from "@/components/MusicContent";
import { ModuleDisabled } from "@/components/ModuleDisabled";
import { PageHeader } from "@/components/PageHeader";
import { getModuleConfig } from "@/lib/api/module-config";

export const metadata: Metadata = {
  title: "音乐",
  description: "博主的背景音乐与歌单分享",
};

export default async function MusicPage() {
  const config = await getModuleConfig();
  if (!config.music_enabled) {
    return <ModuleDisabled moduleLabel="音乐" />;
  }

  return (
    <div className="flex flex-1 flex-col bg-background">
      <PageHeader
        title="音乐时刻"
        subtitle="日常旋律 · 好歌推荐 · 听歌日记，点击歌曲在底部播放条收听"
      />
      <MusicContent />
    </div>
  );
}
