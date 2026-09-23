"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, MessageCircle, Send, User, X } from "lucide-react";
import { listComments, createComment } from "@/lib/api/comments";
import type { Comment } from "@/lib/types";

interface CommentsProps {
  targetType: "article";
  targetId: string;
}

interface CommentNode extends Comment {
  replies: CommentNode[];
}

function buildTree(comments: Comment[]): CommentNode[] {
  const nodeMap = new Map<string, CommentNode>();
  const roots: CommentNode[] = [];

  comments.forEach((c) => nodeMap.set(c.id, { ...c, replies: [] }));
  comments.forEach((c) => {
    const node = nodeMap.get(c.id);
    if (!node) return;
    if (c.parent_id && nodeMap.has(c.parent_id)) {
      nodeMap.get(c.parent_id)!.replies.push(node);
    } else {
      roots.push(node);
    }
  });
  return roots;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function Comments({ targetType, targetId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const [nickname, setNickname] = useState("");
  const [website, setWebsite] = useState("");
  const [content, setContent] = useState("");
  const [replyTo, setReplyTo] = useState<CommentNode | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    const data = await listComments({
      target_type: targetType,
      target_id: targetId,
      page: 1,
      page_size: 100,
    });
    setComments(data.list);
    setLoading(false);
  }, [targetType, targetId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const tree = buildTree(comments);

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!nickname.trim()) {
      errors.nickname = "请填写昵称";
    } else if (nickname.trim().length > 50) {
      errors.nickname = "昵称不能超过 50 字符";
    }
    const trimmedWebsite = website.trim();
    if (
      trimmedWebsite &&
      !/^https?:\/\/[\w.-]+(:\d+)?(\/[\w\-./?%&=]*)?$/i.test(trimmedWebsite)
    ) {
      errors.website = "请输入有效的网址（以 http(s):// 开头）";
    }
    if (!content.trim()) {
      errors.content = "请填写评论内容";
    } else if (content.trim().length > 2000) {
      errors.content = "评论内容不能超过 2000 字符";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitError("");
    setSubmitSuccess(false);
    if (!validate()) return;

    setSubmitting(true);
    try {
      await createComment({
        target_type: targetType,
        target_id: targetId,
        parent_id: replyTo?.id,
        nickname: nickname.trim(),
        website: website.trim() || undefined,
        content: content.trim(),
      });
      setContent("");
      setReplyTo(null);
      setSubmitSuccess(true);
      await fetchComments();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "评论发布失败，请稍后再试"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const totalCount = comments.length;

  return (
    <section aria-label="评论区">
      {/* Heading */}
      <div className="mb-8 flex items-center gap-3">
        <MessageCircle className="h-5 w-5 text-accent" strokeWidth={1.5} />
        <h2 className="text-2xl font-bold text-text-primary">评论</h2>
        {!loading && totalCount > 0 && (
          <span className="rounded-full bg-accent-subtle px-2.5 py-0.5 text-xs font-medium text-accent">
            {totalCount}
          </span>
        )}
      </div>

      {/* Comment Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-border bg-surface p-5 shadow-card md:p-6"
      >
        {replyTo && (
          <div className="mb-4 flex items-center justify-between rounded-full border border-accent/30 bg-accent-subtle px-4 py-2 text-sm text-text-secondary">
            <span>
              回复 <span className="font-medium text-accent">@{replyTo.nickname}</span>
            </span>
            <button
              type="button"
              onClick={() => setReplyTo(null)}
              aria-label="取消回复"
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-text-muted transition-colors duration-200 hover:bg-background-soft hover:text-text-primary"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="comment-nickname" className="sr-only">
              昵称
            </label>
            <div className="relative">
              <User
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle"
                strokeWidth={1.5}
              />
              <input
                id="comment-nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="昵称 *"
                maxLength={50}
                aria-invalid={Boolean(fieldErrors.nickname)}
                className="min-h-11 w-full rounded-full border border-border bg-background-soft pl-10 pr-4 text-sm text-text-primary placeholder:text-text-subtle focus:border-accent focus:outline-none"
              />
            </div>
            {fieldErrors.nickname && (
              <p className="mt-1.5 text-xs text-red-400">{fieldErrors.nickname}</p>
            )}
          </div>
          <div>
            <label htmlFor="comment-website" className="sr-only">
              网站
            </label>
            <input
              id="comment-website"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="网站（选填，https://...）"
              maxLength={255}
              aria-invalid={Boolean(fieldErrors.website)}
              className="min-h-11 w-full rounded-full border border-border bg-background-soft px-4 text-sm text-text-primary placeholder:text-text-subtle focus:border-accent focus:outline-none"
            />
            {fieldErrors.website && (
              <p className="mt-1.5 text-xs text-red-400">{fieldErrors.website}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="comment-content" className="sr-only">
            评论内容
          </label>
          <textarea
            id="comment-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="写下你的想法... *"
            rows={4}
            maxLength={2000}
            aria-invalid={Boolean(fieldErrors.content)}
            className="w-full resize-y rounded-xl border border-border bg-background-soft px-4 py-3 text-sm leading-relaxed text-text-primary placeholder:text-text-subtle focus:border-accent focus:outline-none"
          />
          {fieldErrors.content && (
            <p className="mt-1.5 text-xs text-red-400">{fieldErrors.content}</p>
          )}
        </div>

        {submitError && (
          <p className="mt-3 text-sm text-red-400">{submitError}</p>
        )}
        {submitSuccess && (
          <p className="mt-3 text-sm text-accent">评论已提交，感谢你的留言！</p>
        )}

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-text-subtle">
            {content.trim().length} / 2000
          </span>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-accent-strong px-6 text-sm font-medium text-on-accent transition-all duration-200 ease-out hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" strokeWidth={1.5} />
            )}
            {submitting ? "发布中..." : "发布评论"}
          </button>
        </div>
      </form>

      {/* Comment List */}
      <div className="mt-8">
        {loading ? (
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-xl border border-border bg-surface p-5"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-text-muted/20" />
                  <div className="h-3.5 w-28 rounded bg-text-muted/20" />
                </div>
                <div className="mt-3 h-3.5 w-full rounded bg-text-muted/10" />
                <div className="mt-2 h-3.5 w-2/3 rounded bg-text-muted/10" />
              </div>
            ))}
          </div>
        ) : tree.length === 0 ? (
          <p className="py-12 text-center text-sm text-text-muted">
            还没有评论，来抢沙发吧～
          </p>
        ) : (
          <ul className="space-y-4">
            {tree.map((node) => (
              <CommentItem key={node.id} node={node} onReply={setReplyTo} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function CommentItem({
  node,
  onReply,
}: {
  node: CommentNode;
  onReply: (node: CommentNode) => void;
}) {
  return (
    <li>
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${
              node.is_blogger
                ? "border-accent/40 bg-accent-subtle text-accent"
                : "border-border bg-background-soft text-text-subtle"
            }`}
          >
            <User className="h-4 w-4" strokeWidth={1.5} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-text-primary">
                {node.nickname}
              </span>
              {node.is_blogger && (
                <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium text-on-accent">
                  博主
                </span>
              )}
              <span className="text-xs text-text-subtle">
                {formatDate(node.created_at)}
              </span>
            </div>
            <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-text-secondary">
              {node.content}
            </p>
            <button
              type="button"
              onClick={() => onReply(node)}
              className="mt-2 cursor-pointer text-xs font-medium text-text-muted transition-colors duration-200 hover:text-accent"
            >
              回复
            </button>
          </div>
        </div>
      </div>

      {node.replies.length > 0 && (
        <ul className="ml-6 mt-3 space-y-3 border-l-2 border-accent/20 pl-4 md:ml-10">
          {node.replies.map((reply) => (
            <li key={reply.id}>
              <div className="rounded-xl border border-border bg-background-soft p-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                      reply.is_blogger
                        ? "border-accent/40 bg-accent-subtle text-accent"
                        : "border-border bg-surface text-text-subtle"
                    }`}
                  >
                    <User className="h-3.5 w-3.5" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-text-primary">
                        {reply.nickname}
                      </span>
                      {reply.is_blogger && (
                        <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium text-on-accent">
                          博主
                        </span>
                      )}
                      <span className="text-xs text-text-subtle">
                        {formatDate(reply.created_at)}
                      </span>
                    </div>
                    <p className="mt-1.5 whitespace-pre-wrap break-words text-sm leading-relaxed text-text-secondary">
                      {reply.content}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
