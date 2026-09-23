import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  moreHref?: string;
  moreLabel?: string;
}

/** 板块标题：图标 + 标题 + 手写副题，右侧「查看全部」链接 */
export function SectionHeader({ icon, title, subtitle, moreHref, moreLabel }: SectionHeaderProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
          {icon}
        </span>
        <div>
          <h2 className="text-xl font-bold text-foreground sm:text-2xl">{title}</h2>
          {subtitle && (
            <p className="font-hand text-sm text-muted-foreground sm:text-base">{subtitle}</p>
          )}
        </div>
      </div>
      {moreHref && (
        <Link
          href={moreHref}
          className="inline-flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
        >
          {moreLabel || "查看全部"}
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
