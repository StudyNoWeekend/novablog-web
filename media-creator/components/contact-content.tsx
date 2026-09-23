"use client";

import { useEffect, useState } from "react";
import { Mail, MapPin } from "lucide-react";
import { blogger, type Blogger } from "@/lib/api";
import { getSocialHref, getSocialIcon, getSocialLabel, isEmailLink } from "@/components/social-icon";

/** 联系页：静态导出后构建期取数会被固化，因此博主信息客户端取数实时渲染 */
export function ContactContent() {
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

  const hasEmail = !!info?.email;

  return (
    <div className="relative min-h-screen">
      <div className="glow-orb -right-24 top-16 h-80 w-80 bg-primary/15" aria-hidden />
      <div className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        <div className="text-center">
          <h1 className="font-hand text-4xl text-foreground sm:text-5xl">联系我</h1>
          <p className="doodle-underline mt-2 inline-block font-hand text-xl text-accent">
            期待与你交流创作！
          </p>
          <p className="mx-auto mt-6 max-w-xl text-muted-foreground">
            {info?.blog_description ||
              "无论是合作邀约、拍摄交流还是单纯的打个招呼，都欢迎通过以下方式找到我。"}
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {hasEmail && (
            <a
              href={`mailto:${info!.email}`}
              className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Mail className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">邮箱</p>
                <p className="mt-1 truncate font-medium text-foreground">{info!.email}</p>
              </div>
            </a>
          )}
          {info?.city && (
            <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-6">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
                <MapPin className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="text-xs text-muted-foreground">坐标</p>
                <p className="mt-1 font-medium text-foreground">{info.city}</p>
              </div>
            </div>
          )}
        </div>

        {(info?.social_links?.length ?? 0) > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-bold text-foreground">社交平台</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                        {link.url.replace(/^https?:\/\//, "").replace(/\/.*$/, "") ||
                          getSocialLabel(link)}
                      </p>
                    </div>
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
