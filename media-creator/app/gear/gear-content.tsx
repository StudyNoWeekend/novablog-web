"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, Wrench } from "lucide-react";
import { equipments, type Equipment, type PaginatedResponse } from "@/lib/api";

export function EquipmentContent() {
  const [res, setRes] = useState<PaginatedResponse<Equipment> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    equipments
      .list({ page_size: 100 })
      .then((data) => {
        if (!cancelled) {
          setRes(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "加载失败");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen py-10 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4">
          <h1 className="font-hand text-3xl text-foreground sm:text-4xl">我的装备</h1>
          <p className="doodle-underline self-start font-hand text-lg text-accent lg:-rotate-1">
            好设备，让创意更自由
          </p>
        </div>

        {loading ? (
          <div className="mt-10 flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            加载中...
          </div>
        ) : error ? (
          <div className="mt-10 rounded-2xl border border-border bg-card p-12 text-center text-destructive">
            {error}
          </div>
        ) : res?.list.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-border bg-card p-12 text-center text-muted-foreground">
            <Wrench className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4">暂无设备展示</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {res?.list.map((item) => (
              <div
                key={item.id}
                className="card-lift overflow-hidden rounded-2xl border border-border bg-card"
              >
                <div className="relative aspect-square overflow-hidden bg-muted">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Wrench className="h-10 w-10 text-muted-foreground/50" aria-hidden />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="line-clamp-1 text-base font-semibold text-foreground">
                      {item.name}
                    </h3>
                    {item.brand && (
                      <span className="shrink-0 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                        {item.brand}
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
