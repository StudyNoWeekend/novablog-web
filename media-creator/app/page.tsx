import { HomeContent } from "@/components/home-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "首页",
  description: "精选视频作品、最新文章动态与创作装备。",
};

export default function HomePage() {
  return <HomeContent />;
}
