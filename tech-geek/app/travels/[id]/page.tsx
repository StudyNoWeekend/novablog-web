import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Eye, MapPin, Star } from "lucide-react";
import { travels, getModuleConfig, TravelGuideDetail } from "@/lib/api";
import { ViewTracker } from "@/components/view-tracker";
import { TravelLikeButton } from "@/components/travel-like-button";
import { Comments } from "@/components/comments";
import { ModuleDisabled } from "@/components/module-disabled";
import { TravelCard } from "@/components/travel-card";

interface PageProps {
  params: Promise<{ id: string }>;
}

// 后端不可达时的构建占位 id（output: export 不允许 generateStaticParams 返回空数组）；
// 该占位页渲染时不发任何请求，直接 404，保证构建不依赖后端可达（主题规范 3.4）
const FALLBACK_ID = "__fallback__";

export const dynamicParams = false;

export async function generateStaticParams() {
  try {
    const res = await travels.list({ page: 1, page_size: 100 });
    if (res.list.length === 0) return [{ id: FALLBACK_ID }];
    return res.list.map((travel) => ({ id: travel.id }));
  } catch {
    return [{ id: FALLBACK_ID }];
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  if (id === FALLBACK_ID) {
    return { title: "攻略未找到" };
  }
  try {
    const travel = await travels.detail(id);
    return { title: travel.title, description: travel.summary };
  } catch {
    return { title: "攻略未找到" };
  }
}

/** JSONB map 的防御式取值（后端 attractions/itinerary/reviews 为自由结构） */
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
            star <= Math.round(clamped) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"
          }`}
          aria-hidden="true"
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

  let travel: TravelGuideDetail;
  try {
    travel = await travels.detail(id);
  } catch {
    notFound();
  }

  const attractions = travel.attractions ?? [];
  const itinerary = travel.itinerary ?? [];
  const reviews = travel.reviews ?? [];

  let moreTravels: Awaited<ReturnType<typeof travels.hot>> = [];
  try {
    moreTravels = (await travels.hot(4)).filter((t) => t.id !== travel.id).slice(0, 3);
  } catch {
    moreTravels = [];
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* 返回 */}
      <div className="mx-auto w-full max-w-5xl px-4 pt-8 sm:px-6 lg:px-8">
        <Link
          href="/travels"
          className="inline-flex min-h-10 items-center gap-1.5 rounded-md text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          返回攻略列表
        </Link>
      </div>

      {/* 封面 + 标题信息 */}
      <header className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="relative aspect-[21/9] overflow-hidden rounded-lg bg-muted">
          {travel.cover_image ? (
            <Image
              src={travel.cover_image}
              alt={travel.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1024px"
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-blue-700 via-blue-900 to-slate-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
            {(travel.destination || travel.region) && (
              <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-blue-300">
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                {travel.destination}
                {travel.region ? ` · ${travel.region}` : ""}
              </p>
            )}
            <h1 className="max-w-3xl text-2xl font-bold leading-tight text-white md:text-4xl">
              {travel.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/85">
              {travel.days > 0 && (
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" aria-hidden="true" />
                  {travel.days} 天
                </span>
              )}
              {travel.best_month && <span>最佳月份 {travel.best_month}</span>}
              {travel.rating > 0 && (
                <span className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                  {travel.rating.toFixed(1)}
                  {travel.review_count > 0 && ` (${travel.review_count} 条评价)`}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 正文 */}
      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 lg:px-8 md:py-10">
        <ViewTracker type="travel" id={travel.id} />

        {/* 操作栏 */}
        <div className="flex flex-wrap items-center gap-3">
          <TravelLikeButton travelId={travel.id} initialCount={travel.like_count} />
          <span className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border bg-card px-5 text-sm text-muted-foreground">
            <Eye className="h-4 w-4" aria-hidden="true" />
            {travel.view_count} 次浏览
          </span>
        </div>

        {travel.summary && (
          <blockquote className="mt-8 border-l-2 border-primary pl-4 text-base italic leading-relaxed text-muted-foreground">
            {travel.summary}
          </blockquote>
        )}

        {/* 景点推荐 */}
        {attractions.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-6 text-2xl font-bold text-foreground">景点推荐</h2>
            <div className="space-y-6">
              {attractions.map((attraction, i) => {
                const image = pickString(attraction, ["image", "cover_image", "image_url", "cover", "pic", "photo"]);
                const name = pickString(attraction, ["name", "title"]);
                const description = pickString(attraction, ["description", "content", "intro", "summary", "text"]);
                return (
                  <div
                    key={`attraction-${i}`}
                    className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 sm:flex-row md:p-5"
                  >
                    {image && (
                      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-md bg-muted sm:w-44">
                        <Image
                          src={image}
                          alt={name || `景点 ${i + 1}`}
                          fill
                          sizes="(max-width: 640px) 100vw, 176px"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      {name && <h3 className="text-lg font-semibold text-foreground">{name}</h3>}
                      {description && (
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 行程安排 */}
        {itinerary.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-6 text-2xl font-bold text-foreground">行程安排</h2>
            <ol className="relative space-y-8 border-l-2 border-primary/20 pl-6">
              {itinerary.map((item, i) => {
                const label = pickString(item, ["day", "day_label", "dayLabel", "label", "title", "name"]);
                const description = pickString(item, ["description", "content", "detail", "summary", "text"]);
                return (
                  <li key={`itinerary-${i}`} className="relative">
                    <span className="absolute -left-[31px] top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-primary bg-background" />
                    {label && <h3 className="text-base font-semibold text-primary">{label}</h3>}
                    {description && (
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{description}</p>
                    )}
                  </li>
                );
              })}
            </ol>
          </section>
        )}

        {/* 旅行评价 */}
        {reviews.length > 0 && (
          <section className="mt-14">
            <h2 className="mb-6 text-2xl font-bold text-foreground">旅行评价</h2>
            <div className="space-y-4">
              {reviews.map((review, i) => {
                const author = pickString(review, ["nickname", "user", "author", "name", "reviewer"]);
                const rating = pickNumber(review, ["rating", "score", "star", "stars"]);
                const content = pickString(review, ["content", "comment", "text", "description", "review"]);
                return (
                  <div key={`review-${i}`} className="rounded-lg border border-border bg-card p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-medium text-foreground">{author || "匿名旅行者"}</span>
                      {rating > 0 && <StarRating value={rating} />}
                    </div>
                    {content && <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{content}</p>}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 评论 */}
        <div className="mt-14 border-t border-border pt-12">
          <Comments targetType="travel_guide" targetId={travel.id} />
        </div>
      </div>

      {/* 更多攻略 */}
      {moreTravels.length > 0 && (
        <section className="border-t border-border py-12 md:py-16">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-2xl font-bold text-foreground">更多攻略</h2>
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
