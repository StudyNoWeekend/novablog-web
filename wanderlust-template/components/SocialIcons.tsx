import { Instagram, Mail, Youtube } from "lucide-react";

/**
 * 社交图标字形：优先命中常见平台，其余以首字/前缀展示（数据全部来自博主资料接口）。
 */
export function SocialIconGlyph({
  platform,
  className = "h-4 w-4",
}: {
  platform: string;
  className?: string;
}) {
  const p = platform.toLowerCase();
  if (p === "instagram") return <Instagram className={className} strokeWidth={1.5} />;
  if (p === "youtube") return <Youtube className={className} strokeWidth={1.5} />;
  if (p === "email" || p === "mail") return <Mail className={className} strokeWidth={1.5} />;
  if (p === "weibo" || p === "微博") return <span className="text-xs font-bold">微</span>;
  if (p === "bilibili" || p === "b站") return <span className="text-xs font-bold">B</span>;
  if (p === "xiaohongshu" || p === "小红书") return <span className="text-xs font-bold">红</span>;
  return <span className="text-[10px] font-bold uppercase">{platform.slice(0, 2)}</span>;
}

export function SocialIconLink({
  platform,
  url,
  size = "md",
}: {
  platform: string;
  url: string;
  size?: "md" | "lg";
}) {
  const p = platform.toLowerCase();
  const isMail = p === "email" || p === "mail";
  const href = isMail && !url.startsWith("mailto:") ? `mailto:${url}` : url;
  const dim = size === "lg" ? "h-11 w-11" : "h-9 w-9";
  const iconDim = size === "lg" ? "h-4.5 w-4.5" : "h-4 w-4";

  return (
    <a
      href={href}
      target={isMail ? undefined : "_blank"}
      rel={isMail ? undefined : "noopener noreferrer"}
      aria-label={platform}
      className={`flex ${dim} cursor-pointer items-center justify-center rounded-full text-text-muted transition-colors duration-200 hover:bg-accent-subtle hover:text-accent`}
    >
      <SocialIconGlyph platform={platform} className={iconDim} />
    </a>
  );
}

export function SocialIcons({
  links,
  size = "md",
}: {
  links: { platform: string; url: string; sort_order?: number; name?: string }[];
  size?: "md" | "lg";
}) {
  const sorted = [...links].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
  );
  return (
    <div className="flex items-center gap-1">
      {sorted.map((link) => (
        <SocialIconLink
          key={`${link.platform}-${link.sort_order ?? 0}`}
          platform={link.name || link.platform}
          url={link.url}
          size={size}
        />
      ))}
    </div>
  );
}
