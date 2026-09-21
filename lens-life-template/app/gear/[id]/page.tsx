import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Camera } from "lucide-react";
import { getEquipments, getEquipmentById } from "@/lib/api/equipments";
import { getModuleConfig } from "@/lib/api/module-config";
import { EquipmentCard } from "@/components/EquipmentCard";
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
    return { title: "设备未找到" };
  }
  const equipment = await getEquipmentById(id);
  if (!equipment) return { title: "设备未找到" };
  return {
    title: equipment.name,
    description: equipment.description || equipment.brand || undefined,
  };
}

export default async function EquipmentDetailPage({ params }: PageProps) {
  const config = await getModuleConfig();
  if (!config.equipment_enabled) {
    return <ModuleDisabled moduleLabel="设备" />;
  }

  const { id } = await params;
  if (id === FALLBACK_ID) {
    notFound();
  }
  const equipment = await getEquipmentById(id);
  if (!equipment) {
    notFound();
  }

  const allEquipments = await getEquipments({ page: 1, page_size: 100 });
  const moreEquipments = allEquipments.list
    .filter((item) => item.id !== equipment.id)
    .slice(0, 4);

  return (
    <div className="flex flex-1 flex-col bg-background">
      {/* Back link */}
      <div className="mx-auto w-full max-w-5xl px-4 pt-8 sm:px-6 lg:px-8">
        <Link
          href="/gear"
          className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 text-sm text-text-muted transition-colors duration-200 hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          返回设备列表
        </Link>
      </div>

      {/* Hero image */}
      <header className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="relative aspect-[21/9] overflow-hidden rounded-radius-lg bg-background-soft shadow-card">
          {equipment.image_url ? (
            <Image
              src={equipment.image_url}
              alt={equipment.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1024px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Camera className="h-12 w-12 text-text-subtle" strokeWidth={1} />
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 lg:px-8 md:py-10">
        {equipment.brand && (
          <span className="mb-3 inline-block rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-accent">
            {equipment.brand}
          </span>
        )}
        <h1 className="font-[var(--font-playfair)] text-3xl font-bold text-text-primary md:text-4xl">
          {equipment.name}
        </h1>
        {equipment.description && (
          <div className="mt-6 space-y-4 text-base leading-relaxed text-text-secondary">
            {equipment.description
              .split(/\n+/)
              .map((para) => para.trim())
              .filter(Boolean)
              .map((para, i) => (
                <p key={`para-${i}`}>{para}</p>
              ))}
          </div>
        )}
      </div>

      {/* More equipment */}
      {moreEquipments.length > 0 && (
        <section className="border-t border-border bg-background-soft py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 font-[var(--font-playfair)] text-2xl font-bold text-text-primary">
              更多设备
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {moreEquipments.map((item) => (
                <EquipmentCard key={item.id} equipment={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
