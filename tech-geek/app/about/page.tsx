import type { Metadata } from "next";
import Image from "next/image";
import { MapPin, Mail, Code2 } from "lucide-react";
import { blogger, Blogger } from "@/lib/api";
import { SocialIcon } from "@/components/social-icons";

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
    <div className="flex flex-1 flex-col">
      {/* 页头 */}
      <section className="border-b border-border py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">关于我</h1>
          {profile?.bio && (
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              {profile.bio.length > 60 ? `${profile.bio.slice(0, 60)}...` : profile.bio}
            </p>
          )}
        </div>
      </section>

      {/* 个人资料 */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-10 px-4 sm:px-6 md:flex-row md:items-start md:gap-16 lg:px-8">
          {/* 大头像 */}
          <div className="flex h-56 w-56 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-card bg-muted shadow-md sm:h-72 sm:w-72">
            {profile?.avatar ? (
              <Image
                src={profile.avatar}
                alt={profile.nickname || "博主头像"}
                width={288}
                height={288}
                className="h-full w-full object-cover"
                unoptimized
                priority
              />
            ) : (
              <Code2 className="h-16 w-16 text-muted-foreground" aria-hidden="true" />
            )}
          </div>

          {/* 信息 */}
          <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {profile?.nickname || "开发者"}
            </h2>
            {profile?.tags && profile.tags.length > 0 && (
              <p className="mt-2 font-medium text-primary">
                {profile.tags.join(" | ")}
              </p>
            )}

            <p className="mt-6 max-w-2xl leading-relaxed text-muted-foreground">
              {profile?.bio || profile?.blog_description || "记录学习、思考和实践的点滴。"}
            </p>

            {profile?.tags && profile.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap justify-center gap-2 md:justify-start">
                {profile.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {(profile?.city || profile?.email) && (
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground md:justify-start">
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
        </div>
      </section>

      {/* 关注我 */}
      {socialLinks.length > 0 && (
        <section className="border-t border-border py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">关注我</h2>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {socialLinks.map((social) => (
                <a
                  key={`${social.platform}-${social.sort_order}`}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name || social.platform}
                  className="group flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-card p-3 transition-all duration-200 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors duration-200 group-hover:border-primary/40 group-hover:text-primary">
                    <SocialIcon link={social} className="h-4 w-4" />
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
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
