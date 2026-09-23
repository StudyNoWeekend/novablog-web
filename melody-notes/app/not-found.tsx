import Link from "next/link";
import { Headphones } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-background px-4 py-32">
      <p className="font-[var(--font-script)] text-6xl text-accent/70">404</p>
      <div className="mt-4 flex items-center gap-2 text-text-muted">
        <Headphones className="h-5 w-5" strokeWidth={1.5} />
        <span>这段旋律不存在，可能已被下架或链接有误</span>
      </div>
      <div className="mt-8 flex gap-3">
        <Link
          href="/"
          className="inline-flex min-h-11 cursor-pointer items-center rounded-full bg-accent-strong px-6 text-sm font-medium text-on-accent transition-colors duration-200 hover:bg-accent-hover"
        >
          返回首页
        </Link>
        <Link
          href="/music"
          className="inline-flex min-h-11 cursor-pointer items-center rounded-full border border-border px-6 text-sm font-medium text-text-secondary transition-colors duration-200 hover:border-accent/50 hover:text-accent"
        >
          去听歌
        </Link>
      </div>
    </div>
  );
}
