"use client";

import { Calendar, Flame, Timer } from "lucide-react";
import type { FitnessRecord } from "@/lib/types";

interface FitnessCardProps {
  record: FitnessRecord;
}

/** 训练类型 → 徽标文案 */
export const FITNESS_TYPE_LABELS: Record<string, string> = {
  strength: "力量",
  cardio: "有氧",
  stretch: "拉伸",
};

/** 健身记录卡片（无详情页，仅展示） */
export function FitnessCard({ record }: FitnessCardProps) {
  const typeLabel = FITNESS_TYPE_LABELS[record.type];
  const formattedDate = record.date
    ? new Date(record.date).toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <article className="flex flex-col rounded-radius-md border border-border bg-surface p-5 shadow-card">
      {/* 类型徽标 + 日期 */}
      <div className="flex items-center justify-between gap-3">
        {typeLabel && (
          <span className="rounded-full bg-accent-subtle px-2.5 py-0.5 text-xs font-semibold text-accent-hover">
            {typeLabel}
          </span>
        )}
        {formattedDate && (
          <span className="flex items-center gap-1 text-xs text-text-muted">
            <Calendar className="h-3.5 w-3.5" strokeWidth={1.5} />
            {formattedDate}
          </span>
        )}
      </div>

      {/* 标题 */}
      <h3 className="mt-3 line-clamp-2 font-heading text-lg font-bold leading-snug text-text-primary">
        {record.title || "训练记录"}
      </h3>

      {/* 时长 / 千卡 */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-text-muted">
        {record.duration_min > 0 && (
          <span className="flex items-center gap-1">
            <Timer className="h-3.5 w-3.5" strokeWidth={1.5} />
            {record.duration_min} 分钟
          </span>
        )}
        {record.calories > 0 && (
          <span className="flex items-center gap-1">
            <Flame className="h-3.5 w-3.5" strokeWidth={1.5} />
            {record.calories.toLocaleString()} 千卡
          </span>
        )}
      </div>
    </article>
  );
}
