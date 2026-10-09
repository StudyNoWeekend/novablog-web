"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { blogger, PersonalityInfo, ZodiacInfo } from "@/lib/api";

// 后端星座 key 偶有异体写法（scorpius/capricorn），归一到本地资产文件名
const ZODIAC_KEY_ALIASES: Record<string, string> = {
  scorpius: "scorpio",
  capricorn: "capricornus",
};

function zodiacLogoSrc(key?: string | null): string | null {
  if (!key) return null;
  const normalized = ZODIAC_KEY_ALIASES[key.toLowerCase()] ?? key.toLowerCase();
  return `/profile-logos/zodiac/${normalized}.svg`;
}

function mbtiLogoSrc(key?: string | null): string | null {
  if (!key) return null;
  return `/profile-logos/mbti/${key.toUpperCase()}.svg`;
}

/** 博主星座/性格在客户端运行时获取（静态导出产物构建期拿不到后端数据） */
function useProfileTraits() {
  const [traits, setTraits] = useState<{
    zodiac: ZodiacInfo | null;
    personality: PersonalityInfo | null;
  }>({ zodiac: null, personality: null });

  useEffect(() => {
    let cancelled = false;
    blogger
      .get()
      .catch(() => null)
      .then((data) => {
        if (!cancelled && data) {
          setTraits({
            zodiac: data.zodiac ?? null,
            personality: data.personality ?? null,
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return traits;
}

const ELEMENT_CHIP_STYLES: Record<string, string> = {
  火象: "border-red-200 bg-red-50 text-red-600",
  土象: "border-emerald-200 bg-emerald-50 text-emerald-700",
  风象: "border-sky-200 bg-sky-50 text-sky-600",
  水象: "border-blue-200 bg-blue-50 text-blue-600",
};

/**
 * 首页 Hero 用的星座/性格小徽章；两项都未设置（或博主关闭展示）时不渲染。
 * onDark 对应 Hero 有背景图（叠加暗色遮罩）的情况，用白色系徽章；
 * 无背景图时 Hero 底为 bg-background，浅色模式改用卡片色浅底深字保证对比度。
 */
export function ProfileBadges({ onDark = true }: { onDark?: boolean }) {
  const { zodiac, personality } = useProfileTraits();
  const zodiacSrc = zodiacLogoSrc(zodiac?.key);
  const mbtiSrc = mbtiLogoSrc(personality?.key);
  if (!zodiac && !personality) return null;

  const chipClass = onDark
    ? "border-white/15 bg-white/10 text-white/85 backdrop-blur-sm"
    : "border-border bg-card text-card-foreground dark:border-white/15 dark:bg-white/10 dark:text-white/85";

  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
      {zodiac && (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${chipClass}`}
        >
          {zodiacSrc && (
            <Image
              src={zodiacSrc}
              alt=""
              width={16}
              height={16}
              aria-hidden="true"
            />
          )}
          {zodiac.name}
        </span>
      )}
      {personality && (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${chipClass}`}
        >
          {mbtiSrc && (
            <Image
              src={mbtiSrc}
              alt=""
              width={16}
              height={16}
              className="rounded-[4px]"
              aria-hidden="true"
            />
          )}
          {personality.key}
        </span>
      )}
    </div>
  );
}

/** 关于我区域的星座/性格双卡片；两项都未设置（或博主关闭展示）时不渲染 */
export function ZodiacPersonalityCards({
  className = "",
}: {
  className?: string;
}) {
  const { zodiac, personality } = useProfileTraits();
  const zodiacSrc = zodiacLogoSrc(zodiac?.key);
  const mbtiSrc = mbtiLogoSrc(personality?.key);
  if (!zodiac && !personality) return null;

  return (
    <div className={`grid gap-6 sm:grid-cols-2 ${className}`}>
      {zodiac && (
        <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-lg border border-border bg-muted">
              {zodiacSrc && (
                <Image
                  src={zodiacSrc}
                  alt={`${zodiac.name}星座连线图`}
                  width={44}
                  height={44}
                  className="size-11"
                />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                我的星座
              </p>
              <h3 className="mt-1 font-heading text-2xl font-light text-foreground">
                {zodiac.name}
              </h3>
              {zodiac.date_range && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {zodiac.date_range}
                </p>
              )}
            </div>
          </div>
          {zodiac.element && (
            <span
              className={`mt-4 inline-flex rounded-full border px-3 py-1 text-xs ${
                ELEMENT_CHIP_STYLES[zodiac.element] ??
                "border-border bg-muted text-muted-foreground"
              }`}
            >
              {zodiac.element}
            </span>
          )}
        </div>
      )}
      {personality && (
        <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-lg border border-border bg-muted">
              {mbtiSrc && (
                <Image
                  src={mbtiSrc}
                  alt={`${personality.key} ${personality.name}性格徽章`}
                  width={44}
                  height={44}
                  className="size-11 rounded-md"
                />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                我的性格
              </p>
              <h3 className="mt-1 font-heading text-2xl font-light text-foreground">
                {personality.name}
              </h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {personality.key}
              </p>
            </div>
          </div>
          {personality.description && (
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {personality.description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
