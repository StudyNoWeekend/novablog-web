import { getModuleConfig } from "@/lib/api/module-config";
import { ModuleDisabled } from "@/components/ModuleDisabled";
import { MusicContent } from "@/components/MusicContent";

export const metadata = { title: "游戏音乐" };

export default async function MusicPage() {
  const config = await getModuleConfig();
  if (!config.music_enabled) {
    return <ModuleDisabled moduleLabel="游戏音乐" />;
  }

  return (
    <div className="flex flex-1 flex-col bg-background">
      {/* Page Header */}
      <section className="border-b border-border bg-background-soft py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="font-heading text-4xl font-black text-text-primary md:text-5xl">
            游戏<span className="text-gradient">音乐</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-text-muted md:text-lg">
            战斗 BGM、原声集与氛围歌单，开黑闯关都带感
          </p>
        </div>
      </section>

      <MusicContent />
    </div>
  );
}
