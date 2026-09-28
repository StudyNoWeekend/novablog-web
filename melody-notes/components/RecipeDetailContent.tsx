"use client";

import Image from "next/image";
import { getFileUrl } from "@/lib/api/client";
import type { RecipeDetail } from "@/lib/types";

interface RecipeDetailContentProps {
  detail: RecipeDetail;
}

/**
 * 菜谱食材清单与编号步骤（客户端组件）：
 * 步骤图为相对路径，需在运行时拼接 API 站点根 + /files/（getFileUrl）。
 */
export function RecipeDetailContent({ detail }: RecipeDetailContentProps) {
  const ingredients = Array.isArray(detail.ingredients) ? detail.ingredients : [];
  const steps = Array.isArray(detail.steps) ? detail.steps : [];

  if (ingredients.length === 0 && steps.length === 0) {
    return null;
  }

  return (
    <div className="mt-10 space-y-12">
      {/* 食材清单 */}
      {ingredients.length > 0 && (
        <section>
          <h2 className="mb-5 text-2xl font-bold text-text-primary">食材清单</h2>
          <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {ingredients.map((item, index) => (
              <li
                key={`ingredient-${index}`}
                className="flex items-baseline justify-between gap-3 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm"
              >
                <span className="text-text-primary">{item.name}</span>
                {item.amount && (
                  <span className="shrink-0 text-text-muted">{item.amount}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 编号步骤 */}
      {steps.length > 0 && (
        <section>
          <h2 className="mb-5 text-2xl font-bold text-text-primary">制作步骤</h2>
          <ol className="space-y-8">
            {steps.map((step, index) => (
              <li key={`step-${index}`} className="flex gap-4">
                {/* 步骤序号 */}
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-subtle font-[var(--font-script)] text-lg leading-none text-accent">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="whitespace-pre-wrap text-base leading-relaxed text-text-secondary">
                    {step.text}
                  </p>
                  {step.image && (
                    <div className="relative mt-4 aspect-[16/9] overflow-hidden rounded-xl bg-surface-elevated">
                      <Image
                        src={getFileUrl(step.image)}
                        alt={`步骤 ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 768px"
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
