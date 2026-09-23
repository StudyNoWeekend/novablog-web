"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface MarkdownRendererProps {
  content: string;
}

/**
 * 正文渲染：Markdown 与富文本 HTML 均可渲染
 * （rehype-raw 放行后端富文本编辑器输出的内联 HTML）。
 */
export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose-content">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
