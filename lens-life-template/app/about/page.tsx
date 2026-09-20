import Image from "next/image";
import Link from "next/link";
import { getBloggerProfile } from "@/lib/api/blogger";
import {
  Camera,
  MapPin,
  Image as ImageIcon,
  Instagram,
  Calendar,
  Link as LinkIcon,
} from "lucide-react";


const stats: {
  label: string;
  value: string;
  icon: React.ElementType;
}[] = [];

const milestones: {
  year: string;
  title: string;
  description: string;
}[] = [];

function getSocialIcon(platform: string): React.ElementType {
  const key = platform.toLowerCase();
  if (key === "instagram") return Instagram;
  return LinkIcon;
}

export default async function AboutPage() {
  const profile = await getBloggerProfile();

  return (
    <div className="flex flex-1 flex-col">
      {/* Page header */}
      <section className="border-b border-border bg-background-soft py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="font-[var(--font-playfair)] text-3xl font-medium italic text-text-primary sm:text-4xl">
            关于我
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-text-muted">
            {profile?.bio
              ? profile.bio.length > 60
                ? `${profile.bio.slice(0, 60)}...`
                : profile.bio
              : ""}
          </p>
        </div>
      </section>

      {/* Photographer profile */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-10 md:flex-row md:items-start md:gap-16">
            {/* Avatar */}
            <div className="relative h-56 w-56 flex-shrink-0 overflow-hidden rounded-full border-4 border-surface shadow-card sm:h-72 sm:w-72">
              {profile?.avatar ? (
                <Image
                  src={profile.avatar}
                  alt={profile.nickname || ""}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 224px, 288px"
                  priority
                />
              ) : (
                <div className="h-full w-full bg-surface" />
              )}
            </div>

            {/* Info */}
            <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left">
              <h2 className="font-[var(--font-playfair)] text-3xl font-medium text-text-primary sm:text-4xl">
                {profile?.nickname || ""}
              </h2>
              <p className="mt-2 text-accent">{profile?.tags?.join(" | ") || ""}</p>

              <p className="mt-6 max-w-2xl text-base leading-relaxed text-text-secondary">
                {profile?.bio || ""}
              </p>

              {profile?.tags && profile.tags.length > 0 && (
                <div className="mt-6 flex flex-wrap justify-center gap-2 md:justify-start">
                  {profile.tags.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-border bg-surface px-4 py-1.5 text-sm text-text-muted"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-surface py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="flex flex-col items-center gap-3"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-subtle text-accent">
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                  <div>
                    <p className="font-[var(--font-playfair)] text-3xl font-medium text-text-primary">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-sm text-text-muted">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Milestones / timeline */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center font-[var(--font-playfair)] text-2xl font-medium italic text-text-primary sm:text-3xl">
            经历与成就
          </h2>
          <div className="mt-12 space-y-8">
            {milestones.map((milestone, index) => (
              <TimelineItem
                key={milestone.year + milestone.title}
                milestone={milestone}
                index={index}
                isLast={index === milestones.length - 1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Social links */}
      {profile?.social_links && profile.social_links.length > 0 && (
        <section className="border-t border-border bg-background-soft py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="font-[var(--font-playfair)] text-2xl font-medium italic text-text-primary sm:text-3xl">
                关注我
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-text-muted" />
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {profile.social_links.map((social) => {
                const Icon = getSocialIcon(social.platform);
                return (
                  <Link
                    key={`${social.platform}-${social.sort_order}`}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.platform}
                    className="group flex cursor-pointer items-center gap-3 rounded-radius-md border border-border bg-surface p-3 transition-all duration-200 ease-out hover:border-accent hover:bg-accent-subtle"
                  >
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-border bg-background text-text-muted transition-colors duration-200 ease-out group-hover:border-accent group-hover:text-accent">
                      <Icon className="h-4 w-4" strokeWidth={1.5} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text-primary">
                        {social.name || social.platform}
                      </p>
                      <p className="truncate text-xs text-text-muted">
                        {social.url.replace(/^https?:\/\//, "").replace(/\/.*$/, "")}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function TimelineItem({
  milestone,
  index,
  isLast,
}: {
  milestone: { year: string; title: string; description: string };
  index: number;
  isLast: boolean;
}) {
  return (
    <div className="relative pl-10 sm:pl-12">
      {!isLast && (
        <span className="absolute left-[11px] top-8 h-[calc(100%+1.5rem)] w-px bg-border sm:left-[13px]" />
      )}
      <span className="absolute left-0 top-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-accent bg-accent-subtle sm:top-1">
        <Calendar className="h-3 w-3 text-accent" strokeWidth={2} />
      </span>
      <div className="rounded-radius-md border border-border bg-surface p-5 shadow-card transition-all duration-200 ease-out hover:border-accent/30">
        <span className="text-sm font-medium text-accent">{milestone.year}</span>
        <h3 className="mt-1 text-lg font-medium text-text-primary">
          {milestone.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-text-muted">
          {milestone.description}
        </p>
      </div>
    </div>
  );
}