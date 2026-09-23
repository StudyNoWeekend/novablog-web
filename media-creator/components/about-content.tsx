"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Camera, Clapperboard, Globe, Link as LinkIcon, MapPin } from "lucide-react";
import { blogger, type Blogger } from "@/lib/api";
import { getSocialHref, getSocialIcon, getSocialLabel, isEmailLink } from "@/components/social-icon";

/** 关于我：静态导出后构建期取数会被固化，因此博主信息客户端取数实时渲染 */
export function AboutContent() {
  const [info, setInfo] = useState<Blogger | null>(null);

  useEffect(() => {
    let cancelled = false;
    blogger.get().then((data) => {
      if (!cancelled) setInfo(data);
    }).catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative min-h-screen">
      <div className="glow-orb -left-24 top-10 h-80 w-80 bg-primary/15" aria-hidden />
      <div className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        <Link
          href="/"
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft className="h-4 w-4" />
          返回首页
        </Link>

        {/* 头部：头像 + 手写招呼 */}
        <div className="mt-8 flex flex-col items-center gap-8 sm:flex-row sm:items-end">
          <div className="relative h-44 w-44 shrink-0 overflow-hidden rounded-3xl border border-border shadow-xl shadow-black/30">
            {info?.avatar ? (
              <Image
                src={info.avatar}
                alt={info.nickname || "博主头像"}
                fill
                className="object-cover"
                unoptimized
                priority
              />
            ) : info ? (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <Camera className="h-12 w-12 text-muted-foreground/60" aria-hidden />
              </div>
            ) : (
              <div className="h-full w-full animate-pulse bg-muted" />
            )}
          </div>
          <div className="text-center sm:text-left">
            <h1 className="font-hand text-4xl text-foreground sm:text-5xl">
              你好，我是{info?.nickname || "创作者"}
              <span aria-hidden> 👋</span>
            </h1>
            {info?.tags && info.tags.length > 0 && (
              <p className="mt-3 font-hand text-xl text-primary">{info.tags.join(" · ")}</p>
            )}
          </div>
        </div>

        {/* 简介 */}
        <div className="mt-10 rounded-2xl border border-border bg-card p-6 sm:p-8">
          <p className="text-base leading-loose text-foreground/90">
            {info?.bio || info?.blog_description || ""}
            {!info && <span className="inline-block h-5 w-2/3 animate-pulse rounded bg-muted align-middle" />}
          </p>
        </div>

        {/* 信息栏 */}
        {info && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {info.city && (
              <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                  <MapPin className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">所在城市</p>
                  <p className="mt-0.5 font-medium text-foreground">{info.city}</p>
                </div>
              </div>
            )}
            {(info.tags?.length ?? 0) > 0 && (
              <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                  <Clapperboard className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">创作方向</p>
                  <p className="mt-0.5 font-medium text-foreground">{info.tags!.join(" · ")}</p>
                </div>
              </div>
            )}
            {(info.social_links?.length ?? 0) > 0 && (
              <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                  <Globe className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">发布平台</p>
                  <p className="mt-0.5 font-medium text-foreground">
                    {info.social_links.map((l) => l.name || l.platform).join(" · ")}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 社交链接 */}
        {(info?.social_links?.length ?? 0) > 0 && (
          <div className="mt-12">
            <h2 className="font-hand text-3xl text-foreground">关注我</h2>
            <p className="doodle-underline mt-1 inline-block font-hand text-lg text-accent">
              一起把生活拍成电影！
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {info!.social_links.map((link) => {
                const Icon = getSocialIcon(link.platform);
                return (
                  <a
                    key={`${link.platform}-${link.sort_order}`}
                    href={getSocialHref(link)}
                    target={isEmailLink(link) ? undefined : "_blank"}
                    rel={isEmailLink(link) ? undefined : "noopener noreferrer"}
                    className="group flex cursor-pointer items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{getSocialLabel(link)}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {link.url.replace(/^https?:\/\//, "").replace(/\/.*$/, "") || getSocialLabel(link)}
                      </p>
                    </div>
                    {!isEmailLink(link) && (
                      <LinkIcon
                        className="ml-auto h-4 w-4 shrink-0 text-muted-foreground/50 transition-colors group-hover:text-primary"
                        aria-hidden
                      />
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
