import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Clock, Flame, Dumbbell } from "lucide-react";
import { FitnessRecord } from "@/lib/api";

/** 训练类型映射：strength=力量 cardio=有氧 stretch=拉伸（徽标配色区分） */
export const FITNESS_TYPE_META: Record<string, { label: string; className: string }> = {
  strength: {
    label: "力量",
    className: "border-primary/40 bg-primary/10 text-primary",
  },
  cardio: {
    label: "有氧",
    className: "border-orange-500/40 bg-orange-500/10 text-orange-600 dark:text-orange-400",
  },
  stretch: {
    label: "拉伸",
    className: "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
};

/** 训练类型徽标（未知类型按原始值展示） */
export function FitnessTypeBadge({ type }: { type: string }) {
  const meta = FITNESS_TYPE_META[type];
  if (!meta) {
    return (
      <span className="inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
        {type}
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${meta.className}`}
    >
      {meta.label}
    </span>
  );
}

/** 日期格式化兜底（空值/非法值返回空串，避免 format 抛错） */
function formatDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : format(date, "yyyy-MM-dd", { locale: zhCN });
}

/** 健身训练卡片：日期 + 标题 + 类型徽标 + 时长/千卡 */
export function FitnessCard({ record }: { record: FitnessRecord }) {
  return (
    <article className="group flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-all duration-200 hover:border-primary/40 hover:shadow-md focus-within:ring-2 focus-within:ring-ring">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Dumbbell className="h-6 w-6 text-primary" aria-hidden="true" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate font-semibold tracking-tight text-foreground">
            {record.title || "训练记录"}
          </h3>
          <FitnessTypeBadge type={record.type} />
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">{formatDate(record.date)}</p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-0.5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:gap-4">
        {record.duration_min > 0 && (
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            {record.duration_min} 分钟
          </span>
        )}
        {record.calories > 0 && (
          <span className="flex items-center gap-1">
            <Flame className="h-3.5 w-3.5 text-orange-500" aria-hidden="true" />
            {record.calories} 千卡
          </span>
        )}
      </div>
    </article>
  );
}
