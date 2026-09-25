import { Headphones } from "lucide-react";
import { getModuleConfig } from "@/lib/api/module-config";
import { ModuleDisabled } from "@/components/ModuleDisabled";
import { MusicContent } from "@/components/MusicContent";

export const metadata = {
  title: "音乐",
};

export default async function MusicPage() {
  const config = await getModuleConfig();
  if (!config.music_enabled) {
    return <ModuleDisabled moduleLabel="音乐" />;
  }

  return (
    <div className="flex flex-1 flex-col bg-background">
      {/* Page Header */}
      <section className="border-b border-border bg-gradient-to-br from-lav-subtle via-background-soft to-accent-subtle py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="flex items-center justify-center gap-3 font-heading text-4xl text-text-primary md:text-5xl">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-subtle">
              <Headphones className="h-6 w-6 text-accent" strokeWidth={1.5} />
            </span>
            我的歌单
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-text-muted">
            耳机一戴，谁都不爱 · 点击歌曲即可试听
          </p>
        </div>
      </section>

      <MusicContent />
    </div>
  );
}
