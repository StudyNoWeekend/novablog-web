import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Eye,
  MapPin,
  Star,
} from "lucide-react";
import {
  getTravelById,
  getHotTravels,
  getTravels,
} from "@/lib/api/travels";
import { getModuleConfig } from "@/lib/api/module-config";
import { TravelCard } from "@/components/TravelCard";
import { TravelLikeButton } from "@/components/TravelLikeButton";
import { Comments } from "@/components/Comments";
import { ModuleDisabled } from "@/components/ModuleDisabled";
import { TravelViewTracker } from "@/components/ViewTracker";

interface PageProps {
  params: Promise<{ id: string }>;
}

// 后端不可达时的构建占位 id（output: export 不允许 generateStaticParams 返回空数组）；
// 该占位页渲染时不发任何请求，直接 404，保证构建不依赖后端可达（主题规范 3.4）
const FALLBACK_ID = "__fallback__";

export const dynamicParams = false;

export async function generateStaticParams() {
  const res = await getTravels({ page: 1, page_size: 100 });
  if (res.list.length === 0) return [{ id: FALLBACK_ID }];
  return res.list.map((travel) => ({ id: travel.id }));
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  if (id === FALLBACK_ID) {
    return { title: "攻略未找到" };
  }
  const travel = await getTravelById(id);
  if (!travel) return { title: "攻略未找到" };
  return { title: travel.title, description: travel.summary };
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

function StarRating({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(5, value));
  return (
    <span className="flex items-center gap-0.5" aria-label={`评分 ${clamped} / 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-3.5 w-3.5 ${
            star <= Math.round(clamped)
              ? "fill-accent text-accent"
              : "text-text-subtle"
          }`}
          strokeWidth={1.5}
        />
      ))}
    </span>
  );
}

export default async function TravelDetailPage({ params }: PageProps) {
  const config = await getModuleConfig();
  if (!config.travel_enabled) {
    return <ModuleDisabled moduleLabel="旅行攻略" />;
  }

  const { id } = await params;
  if (id === FALLBACK_ID) {
    notFound();
  }
  const travel = await getTravelById(id);

  if (!travel) {
    notFound();
  }

  const hotTravels = await getHotTravels(4);
  const moreTravels = hotTravels.filter((t) => t.id !== travel.id).slice(0, 3);

  const attractions = travel.attractions ?? [];
  const itinerary = travel.itinerary ?? [];
  const reviews = travel.reviews ?? [];

  return (
    <div className="flex flex-1 flex-col bg-background">
      {/* Back link */}
      <div className="mx-auto w-full max-w-5xl px-4 pt-8 sm:px-6 lg:px-8">
        <Link
          href="/travels"
          className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 text-sm text-text-muted transition-colors duration-200 hover:text-accent"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          返回攻略列表
        </Link>
      </div>

      {/* Hero cover with overlaid info */}
      <header className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="relative aspect-[21/9] overflow-hidden rounded-radius-lg shadow-card">
          {travel.cover_image ? (
            <Image
              src={travel.cover_image}
              alt={travel.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1024px"
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full bg-background-soft" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.2em] text-accent">
              <MapPin className="h-3.5 w-3.5" strokeWidth={1.5} />
              {travel.destination}
              {travel.region ? ` · ${travel.region}` : ""}
            </p>
            <h1 className="max-w-3xl font-[var(--font-playfair)] text-2xl font-bold leading-tight text-white md:text-4xl">
              {travel.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/80">
              {travel.days > 0 && (
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" strokeWidth={1.5} />
                  {travel.days} 天
                </span>
              )}
              {travel.best_month && (
                <span>最佳月份 {travel.best_month}</span>
              )}
              {travel.rating > 0 && (
                <span className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-accent text-accent" strokeWidth={1.5} />
                  {travel.rating.toFixed(1)}
                  {travel.review_count > 0 && ` (${travel.review_count} 条评价)`}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Content column */}
      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 lg:px-8 md:py-10">
        {/* 浏览计数客户端上报（静态导出后服务端计数失效） */}
        <TravelViewTracker id={travel.id} />

        {/* Action bar */}
        <div className="flex flex-wrap items-center gap-3">
          <TravelLikeButton travelId={travel.id} initialCount={travel.like_count} />
          <span className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-surface px-5 text-sm text-text-muted">
            <Eye className="h-4 w-4 text-text-subtle" strokeWidth={1.5} />
            {travel.view_count} 次浏览
          </span>
        </div>

        {/* Summary */}
        {travel.summary && (
          <blockquote className="mt-8 border-l-2 border-accent pl-4 text-base italic leading-relaxed text-text-muted md:pl-5">
            {travel.summary}
          </blockquote>
        )}

        {/* Attractions */}
        {attractions.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-6 font-[var(--font-playfair)] text-2xl font-bold text-text-primary">
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
                return (
                  <div
                    key={`attraction-${i}`}
                    className="flex flex-col gap-4 rounded-radius-md border border-border bg-surface p-4 sm:flex-row md:p-5"
                  >
                    {image ? (
                      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-sm sm:w-44">
                        <Image
                          src={image}
                          alt={name || `景点 ${i + 1}`}
                          fill
                          sizes="(max-width: 640px) 100vw, 176px"
                          className="object-cover"
                        />
                      </div>
                    ) : null}
                    <div className="min-w-0 flex-1">
                      {name && (
                        <h3 className="font-[var(--font-playfair)] text-lg font-semibold text-text-primary">
                          {name}
                        </h3>
                      )}
                      {description && (
                        <p className="mt-2 text-sm leading-relaxed text-text-muted">
                          {description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Itinerary */}
        {itinerary.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-6 font-[var(--font-playfair)] text-2xl font-bold text-text-primary">
              行程安排
            </h2>
            <ol className="relative space-y-8 border-l-2 border-accent/20 pl-6">
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
                    <span className="absolute -left-[31px] top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-accent bg-background" />
                    {label && (
                      <h3 className="font-[var(--font-playfair)] text-base font-semibold text-accent">
                        {label}
                      </h3>
                    )}
                    {description && (
                      <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
                        {description}
                      </p>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>
        )}

        {/* Reviews */}
        {reviews.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-6 font-[var(--font-playfair)] text-2xl font-bold text-text-primary">
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
                    className="rounded-radius-md border border-border bg-surface p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-medium text-text-primary">
                        {author || "匿名旅行者"}
                      </span>
                      {rating > 0 && <StarRating value={rating} />}
                    </div>
                    {content && (
                      <p className="mt-2.5 text-sm leading-relaxed text-text-secondary">
                        {content}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Comments */}
        <div className="mt-14 border-t border-border pt-12">
          <Comments targetType="travel_guide" targetId={travel.id} />
        </div>
      </div>

      {/* More travels */}
      {moreTravels.length > 0 && (
        <section className="border-t border-border bg-background-soft py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 font-[var(--font-playfair)] text-2xl font-bold text-text-primary">
              更多攻略
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {moreTravels.map((hotTravel) => (
                <TravelCard key={hotTravel.id} travel={hotTravel} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
