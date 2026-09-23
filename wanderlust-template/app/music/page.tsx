import { getModuleConfig } from "@/lib/api/module-config";
import { ModuleDisabled } from "@/components/ModuleDisabled";
import { MusicContent } from "@/components/MusicContent";

export const metadata = { title: "旅途音乐" };

export default async function MusicPage() {
  const config = await getModuleConfig();
  if (!config.music_enabled) {
    return <ModuleDisabled moduleLabel="旅途音乐" />;
  }

  return (
    <div className="flex flex-1 flex-col bg-background">
      {/* Page Header */}
      <section className="border-b border-border bg-background-soft py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl text-text-primary md:text-5xl">
            旅途音乐
            <span className="ml-3 align-middle font-hand text-2xl font-medium text-accent/70">
              Music
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-text-muted">
            把路上的风景装进耳机里——写游记、赶车、发呆时都在听
          </p>
        </div>
      </section>

      <MusicContent />
    </div>
  );
}
