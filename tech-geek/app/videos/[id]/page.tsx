import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { videos, getModuleConfig } from "@/lib/api";
import { ModuleDisabled } from "@/components/module-disabled";
import { VideoCard } from "@/components/video-card";

interface PageProps {
  params: Promise<{ id: string }>;
}

// 后端不可达时的构建占位 id（output: export 不允许 generateStaticParams 返回空数组）；
// 该占位页渲染时不发任何请求，直接 404，保证构建不依赖后端可达（主题规范 3.4）
const FALLBACK_ID = "__fallback__";

export const dynamicParams = false;

export async function generateStaticParams() {
  try {
    const res = await videos.list({ page: 1, page_size: 100 });
    if (res.list.length === 0) return [{ id: FALLBACK_ID }];
    return res.list.map((video) => ({ id: video.id }));
  } catch {
    return [{ id: FALLBACK_ID }];
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  if (id === FALLBACK_ID) {
    return { title: "视频未找到" };
  }
  try {
    const video = await videos.detail(id);
    return { title: video.title, description: video.description };
  } catch {
    return { title: "视频未找到" };
  }
}

export default async function VideoDetailPage({ params }: PageProps) {
  const config = await getModuleConfig();
  if (!config.video_enabled) {
    return <ModuleDisabled moduleLabel="视频" />;
  }

  const { id } = await params;
  if (id === FALLBACK_ID) {
    notFound();
  }

  let video;
  try {
    video = await videos.detail(id);
  } catch {
    notFound();
  }

  const platforms = video.platforms ?? [];

  let moreVideos: Awaited<ReturnType<typeof videos.list>>["list"] = [];
  try {
    moreVideos = (await videos.list({ page: 1, page_size: 4 })).list
      .filter((v) => v.id !== video.id)
      .slice(0, 3);
  } catch {
    moreVideos = [];
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-5xl px-4 pt-8 sm:px-6 lg:px-8">
        <Link
          href="/videos"
          className="inline-flex min-h-10 items-center gap-1.5 rounded-md text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          返回视频列表
        </Link>
      </div>

      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
          {video.cover_url ? (
            <Image
              src={video.cover_url}
              alt={video.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1024px"
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-blue-700 via-blue-900 to-slate-900" />
          )}
        </div>

        <h1 className="mt-6 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          {video.title}
        </h1>
        {video.description && (
          <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">
            {video.description}
          </p>
        )}

        {platforms.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-4 text-lg font-semibold text-foreground">观看平台</h2>
            <div className="flex flex-wrap gap-3">
              {platforms.map((platform) => (
                <a
                  key={platform.id}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors duration-200 hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  {platform.platform}
                </a>
              ))}
            </div>
          </section>
        )}
      </div>

      {moreVideos.length > 0 && (
        <section className="mt-6 border-t border-border py-12 md:py-16">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-2xl font-bold text-foreground">更多视频</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {moreVideos.map((moreVideo) => (
                <VideoCard key={moreVideo.id} video={moreVideo} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
