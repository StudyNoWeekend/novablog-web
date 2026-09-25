"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Clapperboard,
  FileText,
  Handshake,
  Music4,
  Play,
} from "lucide-react";

interface DomainCardProps {
  href: string;
  title: string;
  subtitle: string;
  /** 卡片粉彩色调（对应 UI 图蓝/绿/粉/黄四张领域卡） */
  tone: "sky" | "mint" | "rose" | "amber";
  icon: React.ReactNode;
  image?: string | null;
  imageAlt: string;
  /** 图文类卡片（无播放按钮） */
  showPlay?: boolean;
}

const TONE_STYLES: Record<DomainCardProps["tone"], { card: string; icon: string }> = {
  sky: { card: "bg-sky-soft", icon: "bg-sky-deep" },
  mint: { card: "bg-mint-soft", icon: "bg-mint-deep" },
  rose: { card: "bg-rose-soft", icon: "bg-rose-deep" },
  amber: { card: "bg-amber-soft", icon: "bg-amber-deep" },
};

function DomainCard({
  href,
  title,
  subtitle,
  tone,
  icon,
  image,
  imageAlt,
  showPlay = false,
}: DomainCardProps) {
  const tones = TONE_STYLES[tone];

  return (
    <Link
      href={href}
      className={`group flex cursor-pointer flex-col rounded-xl ${tones.card} p-5 shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-card-hover`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white ${tones.icon}`}
          >
            {icon}
          </span>
          <div>
            <h3 className="font-display text-lg leading-tight text-text-primary">
              {title}
            </h3>
            <p className="mt-0.5 text-xs text-text-muted">{subtitle}</p>
          </div>
        </div>
        <ArrowRight
          className="h-4 w-4 shrink-0 text-text-muted transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-text-primary"
          strokeWidth={1.8}
        />
      </div>

      <div className="relative mt-4 aspect-[16/9] w-full overflow-hidden rounded-lg bg-white/70">
        {image ? (
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-text-subtle">
            {icon}
          </div>
        )}
        {showPlay && image && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition-transform duration-200 group-hover:scale-110">
              <Play className="h-4 w-4 translate-x-px fill-current" strokeWidth={0} />
            </span>
          </span>
        )}
      </div>
    </Link>
  );
}

interface DomainSectionProps {
  covers: {
    video?: string | null;
    article?: string | null;
    song?: string | null;
  };
}

/**
 * 首页「我的内容领域」区块（对应 UI 图四张彩色领域卡）：
 * 视频创作 / 图文分享 / 音乐时刻 / 合作联系，预览图取自各模块最新内容
 */
export function DomainSection({ covers }: DomainSectionProps) {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-ink">
            <Play className="h-3.5 w-3.5 translate-x-px fill-current" strokeWidth={0} />
          </span>
          <h2 className="font-display text-2xl text-text-primary md:text-3xl">
            我的内容领域
          </h2>
        </div>
        <div className="mb-10 flex items-end justify-between gap-4">
          <p className="text-sm text-text-muted md:text-base">
            多种形式 · 多元视角 · 只为给你更好的内容体验
          </p>
          <Link
            href="/works"
            className="hidden shrink-0 cursor-pointer items-center gap-1 text-sm font-medium text-text-secondary transition-colors duration-200 hover:text-accent-hover sm:flex"
          >
            查看全部内容
            <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <DomainCard
            href="/works"
            title="视频创作"
            subtitle="Vlog / 旅行 / 记录 / 剪辑教程"
            tone="sky"
            icon={<Clapperboard className="h-5 w-5" strokeWidth={1.5} />}
            image={covers.video}
            imageAlt="视频创作预览"
            showPlay
          />
          <DomainCard
            href="/articles"
            title="图文分享"
            subtitle="生活随笔 / 好物推荐 / 经验干货"
            tone="mint"
            icon={<FileText className="h-5 w-5" strokeWidth={1.5} />}
            image={covers.article}
            imageAlt="图文分享预览"
          />
          <DomainCard
            href="/music"
            title="音乐时刻"
            subtitle="日常旋律 / 好歌推荐 / 听歌日记"
            tone="rose"
            icon={<Music4 className="h-5 w-5" strokeWidth={1.5} />}
            image={covers.song}
            imageAlt="音乐时刻预览"
          />
          <DomainCard
            href="/contact"
            title="合作联系"
            subtitle="品牌合作 / 商务洽谈 / 朋友你好"
            tone="amber"
            icon={<Handshake className="h-5 w-5" strokeWidth={1.5} />}
            image={null}
            imageAlt="合作联系"
          />
        </div>
      </div>
    </section>
  );
}
