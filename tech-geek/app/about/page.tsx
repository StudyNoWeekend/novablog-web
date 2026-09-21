import type { Metadata } from "next";
import Image from "next/image";
import { MapPin, Mail, Code2 } from "lucide-react";
import { blogger, Blogger } from "@/lib/api";
import { getSocialIcon } from "@/components/social-icons";

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
  const socialLinks = [...(profile?.social_links ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* 个人资料 */}
      <section className="flex flex-col items-center gap-10 md:flex-row md:items-start">
        <div className="flex h-40 w-40 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-card bg-muted shadow-md">
          {profile?.avatar ? (
            <Image
              src={profile.avatar}
              alt={profile.nickname || "博主头像"}
              width={160}
              height={160}
              className="h-full w-full object-cover"
              unoptimized
              priority
            />
          ) : (
            <Code2 className="h-14 w-14 text-muted-foreground" aria-hidden="true" />
          )}
        </div>

        <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {profile?.nickname || "关于我"}
          </h1>

          {profile?.tags && profile.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap justify-center gap-2 md:justify-start">
              {profile.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">
            {profile?.bio || profile?.blog_description || "记录学习、思考和实践的点滴。"}
          </p>

          {(profile?.city || profile?.email) && (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground md:justify-start">
              {profile?.city && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  {profile.city}
                </span>
              )}
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-1.5 rounded transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  {profile.email}
                </a>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 社交链接 */}
      {socialLinks.length > 0 && (
        <section className="mt-14">
          <h2 className="text-xl font-bold text-foreground">联系我</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {socialLinks.map((social) => {
              const Icon = getSocialIcon(social.platform);
              return (
                <a
                  key={`${social.platform}-${social.sort_order}`}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name || social.platform}
                  className="group flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-all duration-200 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-foreground">
                      {social.name || social.platform}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {social.url.replace(/^https?:\/\//, "").replace(/\/.*$/, "")}
                    </span>
                  </span>
                </a>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
