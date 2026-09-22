import Link from "next/link";
import { Compass, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-background px-4 py-32 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full border border-accent/25 bg-accent-subtle">
        <Compass className="h-9 w-9 text-accent" strokeWidth={1.5} />
      </div>
      <p className="mt-8 font-display text-4xl text-text-primary">404</p>
      <p className="mt-3 font-display text-xl text-text-secondary">
        这条路好像还没人走过
      </p>
      <p className="mt-2 text-sm text-text-muted">
        你要找的页面不存在，或者已经被移走了。
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-accent px-6 text-sm font-medium text-white transition-colors duration-200 ease-out hover:bg-accent-hover"
      >
        <Home className="h-4 w-4" strokeWidth={1.5} />
        回到首页
      </Link>
    </div>
  );
}
