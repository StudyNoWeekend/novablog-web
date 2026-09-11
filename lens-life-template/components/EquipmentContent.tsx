"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { getEquipments } from "@/lib/api/equipments";
import { EquipmentCard } from "@/components/EquipmentCard";
import type { Equipment } from "@/lib/types";

export function EquipmentContent() {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [activeBrand, setActiveBrand] = useState("");

  useEffect(() => {
    let cancelled = false;
    getEquipments({ page: 1, page_size: 100 }).then((data) => {
      if (cancelled) return;
      setEquipments(data.list);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Brand pills derived from fetched data
  const brandOptions = useMemo(() => {
    const brands = new Set<string>();
    equipments.forEach((item) => {
      if (item.brand && item.brand.trim()) brands.add(item.brand.trim());
    });
    return Array.from(brands).sort((a, b) => a.localeCompare(b, "zh-CN"));
  }, [equipments]);

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return equipments.filter((item) => {
      const matchKeyword =
        !kw ||
        item.name.toLowerCase().includes(kw) ||
        item.brand.toLowerCase().includes(kw) ||
        item.description.toLowerCase().includes(kw);
      const matchBrand = !activeBrand || item.brand === activeBrand;
      return matchKeyword && matchBrand;
    });
  }, [equipments, keyword, activeBrand]);

  return (
    <div className="flex-1 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <h1 className="font-[var(--font-heading)] text-4xl font-medium text-text-primary sm:text-5xl">
            器材
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-text-muted">
            创作路上的伙伴 —— 每一件器材，都值得被认真记录。
          </p>

          {/* Search */}
          <div className="relative mx-auto mt-8 max-w-md">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle"
              strokeWidth={1.5}
            />
            <input
              type="search"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索器材名称、品牌..."
              aria-label="搜索器材"
              className="min-h-11 w-full rounded-full border border-border bg-surface pl-10 pr-4 text-sm text-text-primary placeholder:text-text-subtle focus:border-accent focus:outline-none"
            />
          </div>
        </header>

        {/* Brand filters */}
        {brandOptions.length > 0 && (
          <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setActiveBrand("")}
              aria-pressed={activeBrand === ""}
              className={`min-h-11 cursor-pointer rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ease-out ${
                activeBrand === ""
                  ? "bg-accent text-background"
                  : "border border-border bg-surface text-text-secondary hover:border-accent/40 hover:text-text-primary"
              }`}
            >
              全部品牌
            </button>
            {brandOptions.map((brand) => (
              <button
                key={brand}
                type="button"
                onClick={() => setActiveBrand(brand)}
                aria-pressed={activeBrand === brand}
                className={`min-h-11 cursor-pointer rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ease-out ${
                  activeBrand === brand
                    ? "bg-accent text-background"
                    : "border border-border bg-surface text-text-secondary hover:border-accent/40 hover:text-text-primary"
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse overflow-hidden rounded-radius-md bg-surface shadow-card"
              >
                <div className="aspect-[4/3] bg-text-muted/10" />
                <div className="space-y-2 p-5">
                  <div className="h-3.5 w-24 rounded bg-text-muted/20" />
                  <div className="h-4 w-32 rounded bg-text-muted/20" />
                  <div className="h-3 w-full rounded bg-text-muted/10" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((item) => (
              <EquipmentCard key={item.id} equipment={item} />
            ))}
          </div>
        ) : (
          <p className="py-20 text-center text-text-muted">
            {keyword || activeBrand
              ? "没有符合条件的器材，试试调整筛选条件。"
              : "暂无器材，敬请期待。"}
          </p>
        )}
      </div>
    </div>
  );
}
