import Link from "next/link";
import { CatFace } from "@/components/ComicDoodle";

export default function NotFound() {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-background px-4 py-32 text-center">
      <div className="halftone absolute left-8 top-24 h-28 w-28 rounded-full opacity-50" aria-hidden="true" />
      <CatFace className="h-20 w-20 -rotate-6 text-ink" />
      <h1 className="mt-6 font-display text-3xl text-text-primary">
        这一页被猫咪叼走了
      </h1>
      <p className="mt-3 text-sm text-text-muted">
        你要找的内容不存在，或者已经搬去别的分镜啦。
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-ink px-6 text-sm font-medium text-white transition-colors duration-200 hover:bg-ink-soft"
      >
        返回首页
      </Link>
    </div>
  );
}
