"use client";

import { useEffect, useState } from "react";
import { Share2, Check, Link as LinkIcon } from "lucide-react";
import { articles } from "@/lib/api";

interface ArticleActionsProps {
  slug: string;
}

export function ArticleActions({ slug }: ArticleActionsProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    articles.view(slug).catch(() => {});
  }, [slug]);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleShare}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
      >
        {copied ? <Check className="h-4 w-4 text-primary" /> : <Share2 className="h-4 w-4" />}
        {copied ? "已复制链接" : "分享链接"}
      </button>
      <a
        href={typeof window !== "undefined" ? window.location.href : "#"}
        onClick={(e) => {
          e.preventDefault();
          handleShare();
        }}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="复制链接"
      >
        <LinkIcon className="h-4 w-4" />
      </a>
    </div>
  );
}
