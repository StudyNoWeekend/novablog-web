import { Suspense } from "react";
import { MusicContent } from "@/components/music-content";
import { MusicRowsSkeleton } from "@/components/music-content";

export const metadata = {
  title: "音乐",
  description: "我喜欢的音乐，点击即可播放。",
};

export default function MusicPage() {
  return (
    <div className="min-h-screen py-10 lg:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<MusicRowsSkeleton />}>
          <MusicContent />
        </Suspense>
      </div>
    </div>
  );
}
