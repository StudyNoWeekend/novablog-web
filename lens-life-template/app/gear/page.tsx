import { getModuleConfig } from "@/lib/api/module-config";
import { ModuleDisabled } from "@/components/ModuleDisabled";
import { EquipmentContent } from "@/components/EquipmentContent";


export const metadata = {
  title: "器材",
};

export default async function GearPage() {
  const config = await getModuleConfig();
  if (!config.equipment_enabled) {
    return <ModuleDisabled moduleLabel="器材" />;
  }

  return <EquipmentContent />;
}
