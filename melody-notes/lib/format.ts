/** 日期显示：无效/缺失时返回空串，避免渲染 "Invalid Date" */
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

/** 浏览量缩写：<1k 原样，≥1k k，≥1w w */
export function formatViewCount(count: number): string {
  if (!Number.isFinite(count) || count < 0) return "0";
  if (count >= 10000) {
    const v = count / 10000;
    return `${v >= 10 ? Math.round(v) : v.toFixed(1)}w`;
  }
  if (count >= 1000) {
    const v = count / 1000;
    return `${v >= 10 ? Math.round(v) : v.toFixed(1)}k`;
  }
  return String(count);
}
