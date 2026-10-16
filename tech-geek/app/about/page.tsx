import type { Metadata } from "next";
import { blogger, Blogger } from "@/lib/api";
import { AboutContent } from "@/components/about-content";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "关于我",
    description: "了解博主的更多信息",
  };
}

async function fetchBloggerSafe(): Promise<Blogger | null> {
  try {
    return await blogger.get();
  } catch {
    // 构建期后端不可达时回退空数据，保证静态导出构建不失败
    return null;
  }
}

export default async function AboutPage() {
  const profile = await fetchBloggerSafe();
  return <AboutContent initialProfile={profile} />;
}
