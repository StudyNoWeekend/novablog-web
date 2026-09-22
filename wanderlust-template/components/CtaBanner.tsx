import Link from "next/link";
import { ArrowRight, Send } from "lucide-react";

/**
 * 首页底部 CTA 横幅（UI 图底部）：山景剪影 + 手写标语 + 目的地入口。
 */
export function CtaBanner() {
  return (
    <section className="relative mt-16 overflow-hidden md:mt-20">
      <div className="relative flex h-64 items-center bg-[linear-gradient(180deg,#cfe4d6_0%,#a7cbb5_55%,#84ab93_100%)] md:h-72">
        {/* 太阳 */}
        <span className="absolute right-[18%] top-8 h-14 w-14 rounded-full bg-white/50 blur-[1px]" aria-hidden="true" />
        {/* 远山剪影 */}
        <svg
          viewBox="0 0 1440 320"
          preserveAspectRatio="xMidYMax slice"
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-full w-full text-[#6e9c82]"
          fill="currentColor"
        >
          <path
            opacity="0.5"
            d="M0 210 L170 95 L310 195 L500 70 L690 205 L880 115 L1060 225 L1250 145 L1440 235 L1440 320 L0 320 Z"
          />
          <path
            opacity="0.85"
            d="M0 285 L150 190 L330 275 L550 155 L760 275 L980 195 L1200 285 L1440 205 L1440 320 L0 320 Z"
          />
        </svg>

        {/* Content */}
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-8 px-4 sm:px-6 md:flex-row md:items-center lg:px-8">
          <h2 className="font-display text-3xl leading-snug text-white drop-shadow-md md:text-4xl">
            下一站，你想去哪里？
            <Send
              className="ml-2 inline h-7 w-7 -rotate-12 text-white/90"
              strokeWidth={1.5}
            />
          </h2>
          <Link
            href="/destinations"
            className="inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-full bg-white px-7 text-sm font-medium text-accent shadow-card transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-card-hover"
          >
            查看所有目的地
            <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
          </Link>
        </div>
      </div>
    </section>
  );
}
