import { getModuleConfig } from "@/lib/api/module-config";
import { ModuleDisabled } from "@/components/ModuleDisabled";
import { MusicContent } from "@/components/MusicContent";

export const metadata = { title: "音乐分享" };

export default async function MusicPage() {
  const config = await getModuleConfig();
  if (!config.music_enabled) {
    return <ModuleDisabled moduleLabel="音乐分享" />;
  }

  return (
    <div className="flex flex-1 flex-col bg-background">
      {/* Page Header */}
      <section className="border-b border-border bg-background-soft py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="font-hand text-2xl text-accent">Music &amp; Mood</p>
          <h1 className="mx-auto mt-2 inline-block font-display text-4xl text-text-primary md:text-5xl">
            音乐分享
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-text-muted">
            做饭、吃饭、写日记时都在听的歌，也分享给你
          </p>
        </div>
      </section>

      <MusicContent />
    </div>
  );
}
