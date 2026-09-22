import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Backpack, Tag } from "lucide-react";
import { getEquipmentById, getEquipments } from "@/lib/api/equipments";
import { getModuleConfig } from "@/lib/api/module-config";
import { ModuleDisabled } from "@/components/ModuleDisabled";

interface PageProps {
  params: Promise<{ id: string }>;
}

// 后端不可达时的构建占位 id（output: export 不允许 generateStaticParams 返回空数组）；
// 该占位页渲染时不发任何请求，直接 404，保证构建不依赖后端可达（主题规范 3.4）
const FALLBACK_ID = "__fallback__";

export const dynamicParams = false;

export async function generateStaticParams() {
  const res = await getEquipments({ page: 1, page_size: 100 });
  if (res.list.length === 0) return [{ id: FALLBACK_ID }];
  return res.list.map((equipment) => ({ id: equipment.id }));
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  if (id === FALLBACK_ID) {
    return { title: "装备未找到" };
  }
  const equipment = await getEquipmentById(id);
  if (!equipment) return { title: "装备未找到" };
  return { title: equipment.name, description: equipment.description };
}

export default async function EquipmentDetailPage({ params }: PageProps) {
  const config = await getModuleConfig();
  if (!config.equipment_enabled) {
    return <ModuleDisabled moduleLabel="装备" />;
  }

  const { id } = await params;
  if (id === FALLBACK_ID) {
    notFound();
  }
  const equipment = await getEquipmentById(id);

  if (!equipment) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col bg-background">
      {/* Back link */}
      <div className="mx-auto w-full max-w-5xl px-4 pt-8 sm:px-6 lg:px-8">
        <Link
          href="/gear"
          className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 text-sm text-text-muted transition-colors duration-200 hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          返回装备列表
        </Link>
      </div>

      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-radius-lg bg-background-soft shadow-card">
            {equipment.image_url ? (
              <Image
                src={equipment.image_url}
                alt={equipment.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 480px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#eef3ec,#dfe8e0)]">
                <Backpack className="h-14 w-14 text-accent/40" strokeWidth={1.2} />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            {equipment.brand && (
              <span className="w-fit rounded-full bg-accent-subtle px-3 py-1 text-xs font-medium text-accent">
                {equipment.brand}
              </span>
            )}
            <h1 className="mt-4 font-display text-3xl leading-tight text-text-primary md:text-4xl">
              {equipment.name}
            </h1>
            {equipment.description && (
              <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-text-secondary">
                {equipment.description}
              </p>
            )}
            <div className="mt-auto flex items-center gap-1.5 pt-8 text-xs text-text-subtle">
              <Tag className="h-3.5 w-3.5" strokeWidth={1.5} />
              旅行装备 · {equipment.brand || "未标注品牌"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
