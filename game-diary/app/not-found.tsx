import Link from "next/link";
import { Gamepad2, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center bg-background px-4 py-32">
      <div className="flex flex-col items-center text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-theme shadow-glow">
          <Gamepad2 className="h-10 w-10 text-white" strokeWidth={1.5} />
        </span>
        <p className="mt-8 font-heading text-6xl font-black text-gradient">404</p>
        <h1 className="mt-3 font-heading text-2xl font-bold text-text-primary">
          页面掉线了
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-text-muted">
          看起来这个页面已被老猎人带走了，回新手村看看吧
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-gradient-theme px-6 text-sm font-bold text-white shadow-glow transition-opacity duration-200 ease-out hover:opacity-90"
        >
          <Home className="h-4 w-4" strokeWidth={1.8} />
          返回首页
        </Link>
      </div>
    </div>
  );
}
