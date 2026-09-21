"use client";

import { useEffect, useState } from "react";
import { videos, getModuleConfig, Video } from "@/lib/api";
import { VideoCard } from "@/components/video-card";
import { ErrorState } from "@/components/error-state";
import { ModuleDisabled } from "@/components/module-disabled";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function VideosPage() {
  const [list, setList] = useState<Video[]>([]);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [keyword, setKeyword] = useState("");

  const fetchVideos = async (searchKeyword = keyword) => {
    try {
      setLoading(true);
      const [res, modules] = await Promise.all([
        videos.list({ page: 1, page_size: 60, keyword: searchKeyword.trim() || undefined }),
        getModuleConfig(),
      ]);
      setList(res.list);
      setVideoEnabled(modules.video_enabled);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载视频失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchVideos();
  };

  if (!loading && !videoEnabled) {
    return <ModuleDisabled moduleLabel="视频" />;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">视频</h1>
          <p className="mt-1 text-sm text-muted-foreground">共 {list.length} 个视频</p>
        </div>

        <form onSubmit={handleSearch} className="flex w-full gap-2 md:max-w-md">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索视频标题..."
              className="pl-9"
              aria-label="搜索视频"
            />
          </div>
          <Button type="submit" className="cursor-pointer">
            搜索
          </Button>
        </form>
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-video rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <ErrorState
          title="视频加载失败"
          message={error}
          onRetry={() => fetchVideos()}
        />
      ) : list.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border py-16 text-center text-muted-foreground">
          没有找到符合条件的视频
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}
