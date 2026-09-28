"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownContentProps {
  content: string;
}

/**
 * 轻量 Markdown 渲染组件（开源作品 readme / 书籍书评等），
 * 复用 globals.css 中的文章正文样式类 .prose-content。
 * react-markdown 默认对链接 URL 做白名单过滤，天然防 XSS。
 */
export function MarkdownContent({ content }: MarkdownContentProps) {
  if (!content || !content.trim()) {
    return null;
  }
  return (
    <div className="prose-content">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
