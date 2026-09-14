import { getModuleConfig } from "@/lib/api/module-config";
import { ModuleDisabled } from "@/components/ModuleDisabled";
import { EquipmentContent } from "@/components/EquipmentContent";


export const metadata = {
  title: "器材",
  description: "创作路上的伙伴 —— 每一件器材，都值得被认真记录。",
};

export default async function GearPage() {
  const config = await getModuleConfig();
  if (!config.equipment_enabled) {
    return <ModuleDisabled moduleLabel="器材" />;
  }

  return <EquipmentContent />;
}
