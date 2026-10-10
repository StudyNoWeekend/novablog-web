import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Eye,
  MapPin,
  Navigation,
  Star,
} from "lucide-react";
import type { TravelGuide, TravelGuideDetail } from "@/lib/api";
import { TravelCard } from "./travel-card";
import { TravelLikeButton } from "./travel-like-button";
import { TravelViewTracker } from "./view-tracker";
import { Comments } from "./comments";
import { StarRating } from "./star-rating";

interface TravelDetailPageProps {
  travel: TravelGuideDetail;
  moreTravels: TravelGuide[];
}

// Defensive field pickers for JSONB maps (attractions / itinerary / reviews)
function pickString(map: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = map[key];
    if (typeof value === "string" && value.trim()) return value;
    if (typeof value === "number") return String(value);
  }
  return "";
}

function pickNumber(map: Record<string, unknown>, keys: string[]): number {
  for (const key of keys) {
    const value = map[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
  }
  return 0;
}

// 按 coordType 生成对应地图平台的跳转链接（使用存储的原始坐标，不做坐标系转换）
function mapJumpLink(attraction: Record<string, unknown>): { label: string; url: string } | null {
  const lat = Number(attraction.latitude);
  const lng = Number(attraction.longitude);
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || (lat === 0 && lng === 0)) return null;
  const coordType = String(attraction.coordType ?? attraction.coord_type ?? "").toLowerCase();
  const name = pickString(attraction, ["name", "title"]);
  if (coordType === "gcj02") {
    return {
      label: "在高德地图查看",
      url: `https://uri.amap.com/marker?position=${lng},${lat}&name=${encodeURIComponent(name)}&src=novablog&callnative=1`,
    };
  }
  return {
    label: "在 Google 地图查看",
    url: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
  };
}

export function TravelDetailPage({ travel, moreTravels }: TravelDetailPageProps) {
  const attractions = travel.attractions ?? [];
  const itinerary = travel.itinerary ?? [];
  const reviews = travel.reviews ?? [];

  return (
    <article className="bg-background">
      {/* Hero 封面叠加信息 */}
      <header className="relative aspect-[21/9] min-h-[320px] w-full bg-muted md:aspect-[21/8]">
        {travel.cover_image ? (
          <Image
            src={travel.cover_image}
            alt={travel.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            unoptimized
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-5xl p-6 md:p-10">
          <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.2em] text-white/85">
            <MapPin className="size-3.5" aria-hidden="true" />
            {travel.destination}
            {travel.region ? ` · ${travel.region}` : ""}
          </p>
          <h1 className="mt-3 max-w-3xl font-heading text-3xl font-normal leading-tight text-white md:text-4xl lg:text-5xl">
            {travel.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-white/85">
            {travel.days > 0 && (
              <span className="flex items-center gap-1.5">
                <CalendarDays className="size-4" aria-hidden="true" />
                {travel.days} 天
              </span>
            )}
            {travel.best_month && <span>最佳月份 {travel.best_month}</span>}
            {travel.rating > 0 && (
              <span className="flex items-center gap-1.5">
                <Star className="size-4 fill-primary text-primary" aria-hidden="true" />
                {travel.rating.toFixed(1)}
                {travel.review_count > 0 && ` (${travel.review_count} 条评价)`}
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-16 lg:py-20">
        <Link
          href="/travels"
          className="inline-flex items-center gap-1.5 rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          返回攻略列表
        </Link>

        {/* 浏览计数客户端上报（静态导出后服务端计数失效） */}
        <TravelViewTracker id={travel.id} />

        {/* 点赞 + 浏览 */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <TravelLikeButton travelId={travel.id} initialCount={travel.like_count} />
          <span className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border bg-card px-5 text-sm text-muted-foreground">
            <Eye className="size-4" aria-hidden="true" />
            {travel.view_count} 次浏览
          </span>
        </div>

        {/* 摘要 */}
        {travel.summary && (
          <blockquote className="mt-10 border-l-2 border-primary py-1 pl-5 text-base italic leading-relaxed text-muted-foreground">
            {travel.summary}
          </blockquote>
        )}

        {/* 景点推荐 */}
        {attractions.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-6 font-heading text-2xl font-medium text-foreground">
              景点推荐
            </h2>
            <div className="space-y-6">
              {attractions.map((attraction, i) => {
                const image = pickString(attraction, [
                  "image",
                  "cover_image",
                  "image_url",
                  "cover",
                  "pic",
                  "photo",
                ]);
                const name = pickString(attraction, ["name", "title"]);
                const description = pickString(attraction, [
                  "description",
                  "content",
                  "intro",
                  "summary",
                  "text",
                ]);
                const jump = mapJumpLink(attraction);
                return (
                  <div
                    key={`attraction-${i}`}
                    className="flex flex-col gap-4 overflow-hidden rounded-xl border border-border bg-card p-4 sm:flex-row md:p-5"
                  >
                    {image ? (
                      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-lg bg-muted sm:w-44">
                        <Image
                          src={image}
                          alt={name || `景点 ${i + 1}`}
                          fill
                          sizes="(max-width: 640px) 100vw, 176px"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : null}
                    <div className="min-w-0 flex-1">
                      {name && (
                        <h3 className="font-heading text-lg font-medium text-foreground">
                          {name}
                        </h3>
                      )}
                      {description && (
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {description}
                        </p>
                      )}
                      {jump && (
                        <a
                          href={jump.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full border border-border px-3.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <Navigation className="size-3.5" aria-hidden="true" />
                          {jump.label}
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 行程时间线 */}
        {itinerary.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-6 font-heading text-2xl font-medium text-foreground">
              行程安排
            </h2>
            <ol className="relative space-y-8 border-l border-border pl-6">
              {itinerary.map((item, i) => {
                const label = pickString(item, [
                  "day",
                  "day_label",
                  "dayLabel",
                  "label",
                  "title",
                  "name",
                ]);
                const description = pickString(item, [
                  "description",
                  "content",
                  "detail",
                  "summary",
                  "text",
                ]);
                return (
                  <li key={`itinerary-${i}`} className="relative">
                    <span className="absolute -left-[27px] top-1.5 size-2 rounded-full border-2 border-primary bg-background" />
                    {label && (
                      <h3 className="font-heading text-base font-medium text-primary">
                        {label}
                      </h3>
                    )}
                    {description && (
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {description}
                      </p>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>
        )}

        {/* 评价列表 */}
        {reviews.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-6 font-heading text-2xl font-medium text-foreground">
              旅行评价
            </h2>
            <div className="space-y-4">
              {reviews.map((review, i) => {
                const author = pickString(review, [
                  "nickname",
                  "user",
                  "author",
                  "name",
                  "reviewer",
                ]);
                const rating = pickNumber(review, ["rating", "score", "star", "stars"]);
                const content = pickString(review, [
                  "content",
                  "comment",
                  "text",
                  "description",
                  "review",
                ]);
                return (
                  <div
                    key={`review-${i}`}
                    className="rounded-xl border border-border bg-card p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-medium text-foreground">
                        {author || "匿名旅行者"}
                      </span>
                      {rating > 0 && <StarRating value={rating} />}
                    </div>
                    {content && (
                      <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                        {content}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 评论区 */}
        <div className="mt-14 border-t border-border pt-12">
          <Comments targetType="travel_guide" targetId={travel.id} />
        </div>
      </div>

      {/* 更多攻略 */}
      {moreTravels.length > 0 && (
        <section className="border-t border-border py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 font-heading text-2xl font-medium text-foreground">
              更多攻略
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {moreTravels.map((hotTravel) => (
                <TravelCard key={hotTravel.id} travel={hotTravel} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
