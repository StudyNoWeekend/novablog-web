"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Plane } from "lucide-react";
import type { TravelGuide } from "@/lib/types";

interface TravelBannerProps {
  travels: TravelGuide[];
}

/** 首页底部「下一站，和美食一起去旅行」横幅（对应 UI 图旅行横幅） */
export function TravelBanner({ travels }: TravelBannerProps) {
  const cover = travels.find((t) => t.cover_image)?.cover_image;

  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-xl shadow-card">
        {/* Background */}
        <div className="absolute inset-0 bg-[linear-gradient(115deg,#e8b56a_0%,#d98f3e_55%,#c47a32_100%)]">
          {cover && (
            <Image
              src={cover}
              alt="旅行美食封面"
              fill
              sizes="(max-width: 1280px) 100vw, 1200px"
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(40,24,12,0.72)_0%,rgba(40,24,12,0.42)_55%,rgba(40,24,12,0.18)_100%)]" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-start gap-6 px-6 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-10 md:py-14">
          <h2 className="font-display text-2xl leading-snug text-white drop-shadow-md sm:text-3xl">
            下一站，
            <br className="sm:hidden" />
            和美食一起去旅行
            <Plane className="ml-3 inline h-6 w-6 -rotate-12 text-white/90" strokeWidth={1.6} />
          </h2>
          <Link
            href="/travels"
            className="inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-text-primary shadow-card transition-all duration-200 ease-out hover:bg-accent hover:text-white"
          >
            查看我的旅行美食
            <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
          </Link>
        </div>
      </div>
    </section>
  );
}
