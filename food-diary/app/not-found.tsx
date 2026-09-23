import Link from "next/link";
import { ChefHat, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-background px-4 py-32 text-center">
      <span className="flex h-20 w-20 items-center justify-center rounded-full bg-accent-subtle text-accent">
        <ChefHat className="h-9 w-9" strokeWidth={1.4} />
      </span>
      <p className="mt-6 font-hand text-4xl text-accent">404</p>
      <h1 className="mt-2 font-display text-2xl text-text-primary md:text-3xl">
        这一页好像被偷吃掉了
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-text-muted">
        你要找的内容不在这里，回首页看看别的美味吧
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-accent px-6 text-sm font-medium text-white transition-colors duration-200 ease-out hover:bg-accent-hover"
      >
        <Home className="h-4 w-4" strokeWidth={1.6} />
        返回首页
      </Link>
    </div>
  );
}
