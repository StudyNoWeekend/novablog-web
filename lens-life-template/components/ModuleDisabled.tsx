import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";

interface ModuleDisabledProps {
  moduleLabel?: string;
}

export function ModuleDisabled({ moduleLabel }: ModuleDisabledProps) {
  return (
    <div className="flex flex-1 items-center justify-center bg-background px-4 py-32">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-accent/30 bg-accent-subtle">
          <Lock className="h-8 w-8 text-accent" strokeWidth={1.5} />
        </div>
        <h1 className="mt-6 font-[var(--font-playfair)] text-2xl font-bold text-text-primary md:text-3xl">
          {moduleLabel ? `「${moduleLabel}」模块暂未开启` : "该模块暂未开启"}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          暂未开放此内容，敬请期待
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-border bg-surface px-6 text-sm font-medium text-text-secondary transition-colors duration-200 ease-out hover:border-accent hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          返回首页
        </Link>
      </div>
    </div>
  );
}
