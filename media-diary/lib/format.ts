/**
 * 数字展示格式化：按中文习惯折算「万 / 亿」，与 UI 图数据卡口径一致。
 * 12345 -> 1.2万；120000000 -> 1.2亿；999 -> 999
 */
export function formatCount(n: number): string {
  if (!Number.isFinite(n) || n < 0) return "0";
  if (n >= 100000000) {
    const v = n / 100000000;
    return `${v >= 100 ? Math.round(v) : Math.round(v * 10) / 10}亿+`;
  }
  if (n >= 10000) {
    const v = n / 10000;
    return `${v >= 100 ? Math.round(v) : Math.round(v * 10) / 10}万+`;
  }
  return String(n);
}

/** 日期格式化：2026-09-25T08:00:00Z -> 2026年9月25日 */
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
