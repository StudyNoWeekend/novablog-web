import Link from "next/link";
import { ArrowLeft, Cat } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-background px-4 py-32">
      <div className="flex h-24 w-24 items-center justify-center rounded-full border border-accent/30 bg-accent-subtle">
        <Cat className="h-12 w-12 text-accent" strokeWidth={1.5} />
      </div>
      <p className="mt-8 font-heading text-6xl text-accent">404</p>
      <h1 className="mt-3 font-heading text-2xl text-text-primary">
        呜喵，页面走丢了
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-text-muted">
        你要找的内容可能已被移动或删除了
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-accent px-6 text-sm font-medium text-white transition-colors duration-200 ease-out hover:bg-accent-hover"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
        返回首页
      </Link>
    </div>
  );
}
