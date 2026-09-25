"use client";

import { useEffect, useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { DomainSection } from "@/components/DomainSection";
import { WorksSection } from "@/components/WorksSection";
import { getBloggerProfile, type BloggerProfile } from "@/lib/api/blogger";
import { getArticles } from "@/lib/api/articles";
import { getVideos } from "@/lib/api/videos";
import { getSongs } from "@/lib/api/music";
import { getModuleConfig } from "@/lib/api/module-config";
import type { ModuleConfig } from "@/lib/types";

const ALL_ENABLED: ModuleConfig = {
  article_enabled: true,
  media_enabled: true,
  music_enabled: true,
  video_enabled: true,
  travel_enabled: true,
  portfolio_enabled: true,
  equipment_enabled: true,
  updated_at: "",
};

/**
 * 首页内容（纯客户端取数，构建期不依赖后端可达）：
 * Hero（深色照片背景）→ About（拍立得 + 数据卡）→ 内容领域（四张彩色卡）→ 近期作品
 */
export function HomeContent() {
  const [profile, setProfile] = useState<BloggerProfile | null>(null);
  const [modules, setModules] = useState<ModuleConfig | null>(null);
  const [videoCount, setVideoCount] = useState(0);
  const [articleCount, setArticleCount] = useState(0);
  const [covers, setCover] = useState<{
    video?: string | null;
    article?: string | null;
    song?: string | null;
  }>({});

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getBloggerProfile(),
      getModuleConfig(),
      getVideos({ page: 1, page_size: 1 }),
      getArticles({ page: 1, page_size: 1 }),
      getSongs({ page: 1, page_size: 1 }),
    ]).then(([p, m, v, a, s]) => {
      if (cancelled) return;
      setProfile(p);
      setModules(m);
      setVideoCount(v.total);
      setArticleCount(a.total);
      setCover({
        video: v.list[0]?.cover_url ?? null,
        article: a.list[0]?.cover_image ?? null,
        song: s.list[0]?.cover_url ?? null,
      });

      // 动态设置 favicon 与页面标题，弥补静态导出下 generateMetadata 无法获取个人资料的限制
      if (p?.blog_icon) {
        let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
        if (!link) {
          link = document.createElement("link");
          link.rel = "icon";
          document.head.appendChild(link);
        }
        link.href = p.blog_icon;
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex flex-1 flex-col">
      <HeroSection profile={profile} />
      <AboutSection
        profile={profile}
        stats={{
          totalWorks: videoCount + articleCount,
          videoCount,
          articleCount,
        }}
      />
      <DomainSection covers={covers} />
      {(modules?.video_enabled ?? true) && <WorksSection />}
    </div>
  );
}
