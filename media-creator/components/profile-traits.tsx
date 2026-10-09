"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { blogger, type PersonalityInfo, type ZodiacInfo } from "@/lib/api";

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
      .then((data) => {
        if (!cancelled && data) {
          setTraits({
            zodiac: data.zodiac ?? null,
            personality: data.personality ?? null,
          });
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return traits;
}

/** 元象徽章：底色/文字用主题语义 token 保证深浅色对比度，仅以边框色相区分四象 */
const ELEMENT_CHIP_STYLES: Record<string, string> = {
  火象: "border-destructive/40",
  土象: "border-emerald-500/50",
  风象: "border-sky-500/50",
  水象: "border-primary/50",
};

/** 首页 Hero 用的星座/性格小徽章；两项都未设置（或博主关闭展示）时不渲染。
 * 配色随 Hero 背景自适应：深色主题用白色系玻璃底，浅色主题切语义 token 浅底深字 */
const HERO_BADGE_CLASS =
  "inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/85 backdrop-blur-sm " +
  "light:border-border light:bg-secondary light:text-foreground";

export function ProfileBadges() {
  const { zodiac, personality } = useProfileTraits();
  const zodiacSrc = zodiacLogoSrc(zodiac?.key);
  const mbtiSrc = mbtiLogoSrc(personality?.key);
  if (!zodiac && !personality) return null;

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      {zodiac && (
        <span className={HERO_BADGE_CLASS}>
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
        <span className={HERO_BADGE_CLASS}>
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

/** 关于我页的星座/性格双卡片；两项都未设置（或博主关闭展示）时不渲染 */
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
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-border bg-muted">
              {zodiacSrc && (
                <Image
                  src={zodiacSrc}
                  alt={`${zodiac.name}星座连线图`}
                  width={44}
                  height={44}
                  className="h-11 w-11"
                />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">我的星座</p>
              <h3 className="mt-1 font-hand text-2xl text-foreground">
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
              className={`mt-4 inline-flex rounded-full border bg-secondary px-3 py-1 text-xs text-secondary-foreground ${
                ELEMENT_CHIP_STYLES[zodiac.element] ?? "border-border"
              }`}
            >
              {zodiac.element}
            </span>
          )}
        </div>
      )}
      {personality && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-border bg-muted">
              {mbtiSrc && (
                <Image
                  src={mbtiSrc}
                  alt={`${personality.key} ${personality.name}性格徽章`}
                  width={44}
                  height={44}
                  className="h-11 w-11 rounded-md"
                />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">我的性格</p>
              <h3 className="mt-1 font-hand text-2xl text-foreground">
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
