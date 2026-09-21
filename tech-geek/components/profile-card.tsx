import Image from "next/image";
import Link from "next/link";
import { Code2 } from "lucide-react";
import { Blogger } from "@/lib/api";
import { getSocialIcon } from "@/components/social-icons";

interface ProfileCardProps {
  profile: Blogger | null;
  articleCount: number;
  categoryCount: number;
  tagCount: number;
}

/** 首页侧边栏博主卡片：封面头图 + 头像 + 简介 + 社交链接 + 数据统计 */
export function ProfileCard({
  profile,
  articleCount,
  categoryCount,
  tagCount,
}: ProfileCardProps) {
  const socialLinks = [...(profile?.social_links ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order
  );
  const badge = profile?.tags?.[0];

  const stats = [
    { label: "文章", value: articleCount },
    { label: "分类", value: categoryCount },
    { label: "标签", value: tagCount },
  ];

  return (
    <section className="overflow-hidden rounded-lg border border-border bg-card">
      {/* 封面头图：博主后台配置的 page_background，未配置时回退蓝色渐变 */}
      <div className="relative h-20 w-full bg-gradient-to-br from-blue-700 via-blue-900 to-slate-900">
        {profile?.page_background && (
          <Image
            src={profile.page_background}
            alt=""
            fill
            sizes="340px"
            className="object-cover"
            unoptimized
          />
        )}
      </div>

      <div className="flex flex-col items-center px-4 pb-5">
        <div className="-mt-10 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-card bg-muted">
          {profile?.avatar ? (
            <Image
              src={profile.avatar}
              alt={profile.nickname}
              width={80}
              height={80}
              className="h-full w-full object-cover"
              unoptimized
            />
          ) : (
            <Code2 className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
          )}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <Link
            href="/about"
            className="rounded text-lg font-bold tracking-tight text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {profile?.nickname || "开发者"}
          </Link>
          {badge && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {badge}
            </span>
          )}
        </div>

        {profile?.bio && (
          <p className="mt-2 line-clamp-3 text-center text-sm leading-relaxed text-muted-foreground">
            {profile.bio}
          </p>
        )}

        {socialLinks.length > 0 && (
          <div className="mt-4 flex items-center gap-2">
            {socialLinks.map((link) => {
              const Icon = getSocialIcon(link.platform);
              return (
                <a
                  key={link.platform + link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.name || link.platform}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors duration-200 hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        )}

        <dl className="mt-5 grid w-full grid-cols-3 border-t border-border pt-4 text-center">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <dt className="order-2 text-xs text-muted-foreground">{stat.label}</dt>
              <dd className="order-1 text-lg font-bold text-foreground">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
