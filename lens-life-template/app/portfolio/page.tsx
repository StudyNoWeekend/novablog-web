import { getModuleConfig } from "@/lib/api/module-config";
import { ModuleDisabled } from "@/components/ModuleDisabled";
import { PortfolioContent } from "@/components/PortfolioContent";


export const metadata = {
  title: "作品集",
  description: "光影的切片 —— 从雪山之巅到城市街头，记录那些转瞬即逝的瞬间。",
};

export default async function PortfolioPage() {
  const config = await getModuleConfig();
  if (!config.portfolio_enabled) {
    return <ModuleDisabled moduleLabel="作品集" />;
  }

  return <PortfolioContent />;
}
