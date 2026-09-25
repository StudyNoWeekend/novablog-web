import Link from "next/link";
import { Compass, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-background px-4 py-32">
      <div className="flex flex-col items-center text-center">
        <p className="font-hand text-6xl text-accent">404</p>
        <h1 className="mt-4 font-display text-2xl text-text-primary md:text-3xl">
          这一页还没拍进日记里
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          你访问的内容可能已下架或地址有误，回首页继续探索吧
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-accent px-6 text-sm font-semibold text-ink shadow-card transition-colors duration-200 hover:bg-accent-hover"
          >
            <Home className="h-4 w-4" strokeWidth={1.5} />
            返回首页
          </Link>
          <Link
            href="/works"
            className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-border bg-surface px-6 text-sm font-medium text-text-secondary transition-colors duration-200 hover:border-accent hover:text-accent-hover"
          >
            <Compass className="h-4 w-4" strokeWidth={1.5} />
            看看作品
          </Link>
        </div>
      </div>
    </div>
  );
}
