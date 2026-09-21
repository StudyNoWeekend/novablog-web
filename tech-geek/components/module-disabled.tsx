import Link from "next/link";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ModuleDisabledProps {
  moduleLabel: string;
}

/** 模块开关关闭时的占位页（由后端 module-config 驱动） */
export function ModuleDisabled({ moduleLabel }: ModuleDisabledProps) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Lock className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
      </div>
      <h1 className="mt-6 text-2xl font-bold tracking-tight text-foreground">
        {moduleLabel}模块未开启
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        博主暂时关闭了{moduleLabel}功能，去看看其他内容吧。
      </p>
      <Button asChild className="mt-8 cursor-pointer">
        <Link href="/">返回首页</Link>
      </Button>
    </div>
  );
}
