"use client";

import { useEffect, useMemo, useState } from "react";
import { Send, User, Link2, CornerDownRight, Loader2 } from "lucide-react";
import { comments, Comment } from "@/lib/api";
import { ErrorState, EmptyState } from "./error-state";
import { cn } from "@/lib/utils";

interface CommentsProps {
  targetType: string;
  targetId: string;
}

interface CommentNode extends Comment {
  children: CommentNode[];
}

function buildTree(list: Comment[]): CommentNode[] {
  const map = new Map<string, CommentNode>();
  const roots: CommentNode[] = [];

  list.forEach((item) => {
    map.set(item.id, { ...item, children: [] });
  });

  list.forEach((item) => {
    const node = map.get(item.id)!;
    if (item.parent_id && map.has(item.parent_id)) {
      map.get(item.parent_id)!.children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
}

function formatTime(iso: string) {
  const date = new Date(iso);
  return date.toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" });
}

export function Comments({ targetType, targetId }: CommentsProps) {
  const [list, setList] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const [form, setForm] = useState({ nickname: "", website: "", content: "" });
  const [formError, setFormError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await comments.list({ target_type: targetType, target_id: targetId, page: 1, page_size: 100 });
      setList(res.list);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载评论失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetType, targetId]);

  const tree = useMemo(() => buildTree(list), [list]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!form.nickname.trim() || !form.content.trim()) {
      setFormError("请填写昵称和评论内容");
      return;
    }
    setSubmitting(true);
    try {
      await comments.create({
        target_type: targetType,
        target_id: targetId,
        parent_id: replyTo?.id,
        nickname: form.nickname.trim(),
        website: form.website.trim() || undefined,
        content: form.content.trim(),
      });
      setForm({ nickname: form.nickname, website: form.website, content: "" });
      setReplyTo(null);
      await load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "提交失败");
    } finally {
      setSubmitting(false);
    }
  };

  const renderNode = (node: CommentNode, depth = 0) => (
    <div
      key={node.id}
      className={cn("rounded-xl border border-border bg-card p-4", depth > 0 && "mt-3 ml-4 border-l-2 pl-4")}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="inline-flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <User className="size-4" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {node.nickname}
              {node.is_blogger && (
                <span className="ml-2 rounded bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">博主</span>
              )}
            </p>
            <p className="text-xs text-muted-foreground">{formatTime(node.created_at)}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setReplyTo(node)}
          className="text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring rounded cursor-pointer"
        >
          回复
        </button>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90">{node.content}</p>
      {node.children.length > 0 && (
        <div className="mt-3">
          {node.children.map((child) => renderNode(child, depth + 1))}
        </div>
      )}
    </div>
  );

  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-normal text-foreground">评论</h2>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="comment-nickname" className="text-sm font-medium text-foreground">
              昵称 <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="comment-nickname"
                type="text"
                value={form.nickname}
                onChange={(e) => setForm((f) => ({ ...f, nickname: e.target.value }))}
                placeholder="你的名字"
                maxLength={50}
                className="w-full rounded-lg border border-input bg-background py-2.5 pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="comment-website" className="text-sm font-medium text-foreground">
              网站（可选）
            </label>
            <div className="relative">
              <Link2 className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="comment-website"
                type="url"
                value={form.website}
                onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                placeholder="https://你的网站.com"
                className="w-full rounded-lg border border-input bg-background py-2.5 pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
              />
            </div>
          </div>
        </div>

        {replyTo && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CornerDownRight className="size-4" />
            回复 <span className="font-medium text-foreground">{replyTo.nickname}</span>
            <button
              type="button"
              onClick={() => setReplyTo(null)}
              className="ml-2 text-xs underline-offset-2 hover:underline focus-visible:ring-2 focus-visible:ring-ring rounded cursor-pointer"
            >
              取消回复
            </button>
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="comment-content" className="text-sm font-medium text-foreground">
            评论内容 <span className="text-destructive">*</span>
          </label>
          <textarea
            id="comment-content"
            value={form.content}
            onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
            placeholder="写下你的想法…"
            rows={4}
            maxLength={2000}
            className="w-full resize-none rounded-lg border border-input bg-background p-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
          />
        </div>

        {formError && <p className="text-sm text-destructive">{formError}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/85 disabled:opacity-60 focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
        >
          {submitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          {submitting ? "提交中…" : "发表评论"}
        </button>
      </form>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-full bg-muted" />
                <div className="h-4 w-24 rounded-md bg-muted" />
              </div>
              <div className="mt-3 h-4 w-3/4 rounded-md bg-muted" />
            </div>
          ))}
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : tree.length === 0 ? (
        <EmptyState title="暂无评论" description="成为第一个评论的人吧" />
      ) : (
        <div className="space-y-4">{tree.map((node) => renderNode(node))}</div>
      )}
    </section>
  );
}
