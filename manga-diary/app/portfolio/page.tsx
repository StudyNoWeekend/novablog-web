import { getModuleConfig } from "@/lib/api/module-config";
import { ModuleDisabled } from "@/components/ModuleDisabled";
import { PortfolioContent } from "@/components/PortfolioContent";

export const metadata = {
  title: "漫画作品",
};

export default async function PortfolioPage() {
  const config = await getModuleConfig();
  if (!config.portfolio_enabled) {
    return <ModuleDisabled moduleLabel="漫画作品" />;
  }

  return <PortfolioContent />;
}
