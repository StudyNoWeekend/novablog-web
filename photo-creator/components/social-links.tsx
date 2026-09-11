"use client";

import { Mail, Globe, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  mail: Mail,
  email: Mail,
};

const labelMap: Record<string, string> = {
  mail: "邮件",
  email: "邮件",
};

interface SocialLink {
  platform: string;
  url: string;
  sort_order: number;
}

interface SocialLinksProps {
  links?: SocialLink[];
  className?: string;
  iconClassName?: string;
}

export function SocialLinks({ links = [], className, iconClassName }: SocialLinksProps) {
  if (links.length === 0) return null;

  const sorted = [...links].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {sorted.map((link) => {
        const platformKey = link.platform.toLowerCase();
        const Icon = iconMap[platformKey] ?? Globe;
        return (
          <a
            key={link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={labelMap[platformKey] ?? `${link.platform} 社交链接`}
            className={cn(
              "inline-flex items-center justify-center rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
              iconClassName
            )}
          >
            <Icon className="size-5" />
          </a>
        );
      })}
    </div>
  );
}
