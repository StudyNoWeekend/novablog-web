import Link from "next/link";
import { Lock } from "lucide-react";

interface ModuleDisabledProps {
  moduleLabel: string;
}

/** 模块开关关闭时的占位页（由后端 module-config 驱动），按主题高留白风格呈现 */
export function ModuleDisabled({ moduleLabel }: ModuleDisabledProps) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:px-8">
      <div className="flex size-14 items-center justify-center rounded-full bg-muted">
        <Lock className="size-6 text-muted-foreground" aria-hidden="true" />
      </div>
      <p className="mt-8 text-xs font-medium uppercase tracking-[0.2em] text-primary">
        Module Disabled
      </p>
      <h1 className="mt-3 font-heading text-3xl font-normal text-foreground md:text-4xl">
        {moduleLabel}模块未开启
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
        博主暂时关闭了{moduleLabel}功能，去看看其他内容吧。
      </p>
      <Link
        href="/"
        className="mt-10 inline-flex cursor-pointer items-center rounded-full border border-border px-6 py-2.5 text-sm text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
      >
        返回首页
      </Link>
    </div>
  );
}
