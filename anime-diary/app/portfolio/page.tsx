import { Palette } from "lucide-react";
import { getModuleConfig } from "@/lib/api/module-config";
import { ModuleDisabled } from "@/components/ModuleDisabled";
import { PortfolioContent } from "@/components/PortfolioContent";

export const metadata = {
  title: "作品",
};

export default async function PortfolioPage() {
  const config = await getModuleConfig();
  if (!config.portfolio_enabled) {
    return <ModuleDisabled moduleLabel="作品" />;
  }

  return (
    <div className="flex flex-1 flex-col bg-background">
      {/* Page Header */}
      <section className="border-b border-border bg-gradient-to-br from-accent-subtle via-background-soft to-sky-subtle py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="flex items-center justify-center gap-3 font-heading text-4xl text-text-primary md:text-5xl">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-subtle">
              <Palette className="h-6 w-6 text-accent" strokeWidth={1.5} />
            </span>
            插画作品
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-text-muted">
            原创插画、同人创作与壁纸，点击画册即可浏览
          </p>
        </div>
      </section>

      <PortfolioContent />
    </div>
  );
}
