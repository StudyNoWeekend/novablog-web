"use client";

import { useCallback, useEffect, useState } from "react";
import { Send, MessageCircle, User, Loader2, Reply, X } from "lucide-react";
import { comments, type Comment } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CommentsProps {
  targetType: string;
  targetId: string;
}

interface CommentFormData {
  nickname: string;
  website: string;
  content: string;
}

export function Comments({ targetType, targetId }: CommentsProps) {
  const [list, setList] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<CommentFormData>({ nickname: "", website: "", content: "" });
  const [submitting, setSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<Comment | null>(null);

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await comments.list({ target_type: targetType, target_id: targetId, page_size: 100 });
      setList(res.list || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载评论失败");
    } finally {
      setLoading(false);
    }
  }, [targetType, targetId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const validate = () => {
    if (!form.nickname.trim()) return "请输入昵称";
    if (form.nickname.length > 50) return "昵称不能超过 50 个字符";
    if (!form.content.trim()) return "请输入评论内容";
    if (form.content.length > 2000) return "评论内容不能超过 2000 个字符";
    if (form.website && !/^https?:\/\/.+/.test(form.website)) return "网站地址格式不正确";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setSubmitting(true);
    setError(null);
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
      await fetchComments();
    } catch (err) {
      setError(err instanceof Error ? err.message : "提交评论失败");
    } finally {
      setSubmitting(false);
    }
  };

  const topLevel = list.filter((c) => !c.parent_id);
  const replies = (parentId: string) => list.filter((c) => c.parent_id === parentId);

  return (
    <section className="rounded-2xl bg-card p-5 shadow-sm border border-border sm:p-6">
      <h2 className="flex items-center gap-2 text-xl font-bold text-foreground">
        <MessageCircle className="h-5 w-5 text-primary" />
        评论
        <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
          {list.length}
        </span>
      </h2>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {replyTo && (
          <div className="flex items-center justify-between rounded-xl bg-secondary px-3 py-2 text-sm text-secondary-foreground">
            <span>回复 @{replyTo.nickname}</span>
            <button
              type="button"
              onClick={() => setReplyTo(null)}
              className="rounded-md p-1 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="取消回复"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="comment-nickname" className="text-sm font-medium text-foreground">
              昵称 <span className="text-destructive">*</span>
            </label>
            <input
              id="comment-nickname"
              type="text"
              value={form.nickname}
              onChange={(e) => setForm((f) => ({ ...f, nickname: e.target.value }))}
              placeholder="怎么称呼你"
              className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="comment-website" className="text-sm font-medium text-foreground">
              网站（可选）
            </label>
            <input
              id="comment-website"
              type="url"
              value={form.website}
              onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
              placeholder="https://example.com"
              className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="comment-content" className="text-sm font-medium text-foreground">
            评论内容 <span className="text-destructive">*</span>
          </label>
          <textarea
            id="comment-content"
            value={form.content}
            onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
            placeholder="写下你的想法..."
            rows={4}
            className="w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button
          type="submit"
          disabled={submitting}
          className="gradient-creator border-0 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring"
        >
          {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
          发表评论
        </Button>
      </form>

      <div className="mt-8 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-10 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            加载评论中...
          </div>
        ) : topLevel.length === 0 ? (
          <div className="rounded-xl bg-muted py-10 text-center text-sm text-muted-foreground">
            暂无评论，来抢沙发吧！
          </div>
        ) : (
          topLevel.map((comment) => (
            <div key={comment.id} className="space-y-3">
              <CommentItem comment={comment} onReply={setReplyTo} />
              {replies(comment.id).map((reply) => (
                <div key={reply.id} className="ml-8 sm:ml-12 border-l-2 border-border pl-4">
                  <CommentItem comment={reply} onReply={setReplyTo} isReply />
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function CommentItem({
  comment,
  onReply,
  isReply,
}: {
  comment: Comment;
  onReply: (c: Comment) => void;
  isReply?: boolean;
}) {
  return (
    <div className={cn("flex gap-3 rounded-xl p-3 transition-colors hover:bg-muted/50", isReply && "bg-muted/30")}>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
        <User className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-foreground">{comment.nickname}</span>
          {comment.is_blogger && (
            <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground">
              博主
            </span>
          )}
          <time className="text-xs text-muted-foreground">
            {new Date(comment.created_at).toLocaleString("zh-CN")}
          </time>
        </div>
        <p className="mt-1.5 whitespace-pre-wrap text-sm text-foreground/90">{comment.content}</p>
        {comment.website && (
          <a
            href={comment.website}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-block text-xs text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring rounded"
          >
            {comment.website}
          </a>
        )}
        <button
          type="button"
          onClick={() => onReply(comment)}
          className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-primary focus-visible:ring-2 focus-visible:ring-ring rounded"
        >
          <Reply className="h-3.5 w-3.5" />
          回复
        </button>
      </div>
    </div>
  );
}
