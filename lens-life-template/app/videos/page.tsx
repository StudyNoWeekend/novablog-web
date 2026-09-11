import { Search } from "lucide-react";
import { getVideos } from "@/lib/api/videos";
import { getModuleConfig } from "@/lib/api/module-config";
import { VideoCard } from "@/components/VideoCard";
import { ModuleDisabled } from "@/components/ModuleDisabled";

export const dynamic = "force-dynamic";

interface SearchParams {
  keyword?: string;
  page?: string;
}

export default async function VideosPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const config = await getModuleConfig();
  if (!config.video_enabled) {
    return <ModuleDisabled moduleLabel="视频" />;
  }

  const params = await searchParams;
  const currentPage = params.page ? Number(params.page) : 1;

  const videosData = await getVideos({
    keyword: params.keyword,
    page: currentPage,
    page_size: 12,
  });

  const videos = videosData.list;

  return (
    <div className="flex flex-1 flex-col bg-background">
      {/* Page Header */}
      <section className="border-b border-border bg-background-soft py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="font-[var(--font-playfair)] text-4xl font-bold text-text-primary md:text-5xl">
            视频
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-text-muted md:text-lg">
            用镜头记录动态的世界 —— 航拍、延时与旅拍 Vlog。
          </p>

          {/* Keyword Search */}
          <form
            action="/videos"
            method="GET"
            className="mx-auto mt-8 flex max-w-md items-center"
          >
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle"
                strokeWidth={1.5}
              />
              <input
                type="search"
                name="keyword"
                defaultValue={params.keyword ?? ""}
                placeholder="搜索视频标题..."
                aria-label="搜索视频"
                className="min-h-11 w-full rounded-full border border-border bg-surface pl-10 pr-4 text-sm text-text-primary placeholder:text-text-subtle focus:border-accent focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="ml-2 min-h-11 shrink-0 cursor-pointer rounded-full bg-accent px-5 text-sm font-medium text-background transition-colors duration-200 ease-out hover:bg-accent-hover"
            >
              搜索
            </button>
          </form>
        </div>
      </section>

      {/* Video List */}
      <section className="flex-1 py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {videos.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {videos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>

              {/* Pagination */}
              {videosData.total_pages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  {currentPage > 1 && (
                    <a
                      href={buildHref({ ...params, page: String(currentPage - 1) })}
                      className="flex h-10 cursor-pointer items-center rounded-full border border-border bg-surface px-4 text-sm text-text-secondary transition-colors duration-200 hover:border-accent hover:text-accent"
                    >
                      上一页
                    </a>
                  )}
                  <span className="px-4 text-sm text-text-muted">
                    {currentPage} / {videosData.total_pages}
                  </span>
                  {currentPage < videosData.total_pages && (
                    <a
                      href={buildHref({ ...params, page: String(currentPage + 1) })}
                      className="flex h-10 cursor-pointer items-center rounded-full border border-border bg-surface px-4 text-sm text-text-secondary transition-colors duration-200 hover:border-accent hover:text-accent"
                    >
                      下一页
                    </a>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-lg text-text-muted">
                {params.keyword
                  ? `未找到与「${params.keyword}」相关的视频`
                  : "暂无视频作品，敬请期待"}
              </p>
              <a
                href="/videos"
                className="mt-4 cursor-pointer text-sm font-medium text-accent transition-colors duration-200 ease-out hover:text-accent-hover"
              >
                查看全部视频
              </a>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function buildHref(params: Record<string, string | undefined>): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });
  const qs = query.toString();
  return qs ? `/videos?${qs}` : "/videos";
}
