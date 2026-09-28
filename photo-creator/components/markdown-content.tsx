"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownContentProps {
  content: string;
}

/**
 * 轻量 Markdown 渲染（开源作品 README / 书评 / 游戏简评共用），
 * 复用主题现有文章正文样式类 `.article-body`（见 app/globals.css 的 @layer components）
 */
export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="article-body max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
