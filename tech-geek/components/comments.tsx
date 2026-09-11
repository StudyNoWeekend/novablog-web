"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { MessageCircle, Reply, Send, User } from "lucide-react";
import { comments, Comment, CreateCommentPayload } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loading } from "./loading";
import { ErrorState } from "./error-state";

interface CommentsProps {
  targetType: "article" | "travel_guide";
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
  const [submitting, setSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const [form, setForm] = useState<CommentFormData>({
    nickname: "",
    website: "",
    content: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<CommentFormData>>({});

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await comments.list({
        target_type: targetType,
        target_id: targetId,
        page: 1,
        page_size: 100,
      });
      setList(res.list);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载评论失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetType, targetId]);

  const validate = (): boolean => {
    const errors: Partial<CommentFormData> = {};
    if (!form.nickname.trim() || form.nickname.length > 50) {
      errors.nickname = "昵称长度应为 1-50 字符";
    }
    if (form.website && !/^https?:\/\/.+/.test(form.website)) {
      errors.website = "请输入有效的网址（以 http:// 或 https:// 开头）";
    }
    if (!form.content.trim() || form.content.length > 2000) {
      errors.content = "评论内容长度应为 1-2000 字符";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || submitting) return;

    setSubmitting(true);
    try {
      const payload: CreateCommentPayload = {
        target_type: targetType,
        target_id: targetId,
        parent_id: replyTo?.id,
        nickname: form.nickname.trim(),
        website: form.website.trim() || undefined,
        content: form.content.trim(),
      };
      await comments.create(payload);
      setForm({ nickname: form.nickname, website: form.website, content: "" });
      setReplyTo(null);
      await fetchComments();
    } catch (err) {
      setError(err instanceof Error ? err.message : "提交评论失败");
    } finally {
      setSubmitting(false);
    }
  };

  const topComments = list.filter((c) => !c.parent_id);
  const replies = list.filter((c) => c.parent_id);

  return (
    <section className="mt-12 rounded-lg border border-border bg-card p-5 md:p-6" aria-labelledby="comments-heading">
      <h2 id="comments-heading" className="flex items-center gap-2 text-xl font-bold text-foreground">
        <MessageCircle className="h-5 w-5 text-primary" aria-hidden="true" />
        评论 ({list.length})
      </h2>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="comment-nickname" className="mb-1.5 block text-sm font-medium text-foreground">
              昵称 <span className="text-destructive">*</span>
            </label>
            <Input
              id="comment-nickname"
              value={form.nickname}
              onChange={(e) => setForm((f) => ({ ...f, nickname: e.target.value }))}
              placeholder="你的名字"
              aria-invalid={!!formErrors.nickname}
              aria-describedby={formErrors.nickname ? "nickname-error" : undefined}
            />
            {formErrors.nickname && (
              <p id="nickname-error" className="mt-1 text-xs text-destructive">
                {formErrors.nickname}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="comment-website" className="mb-1.5 block text-sm font-medium text-foreground">
              网站（可选）
            </label>
            <Input
              id="comment-website"
              value={form.website}
              onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
              placeholder="https://example.com"
              aria-invalid={!!formErrors.website}
              aria-describedby={formErrors.website ? "website-error" : undefined}
            />
            {formErrors.website && (
              <p id="website-error" className="mt-1 text-xs text-destructive">
                {formErrors.website}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="comment-content" className="mb-1.5 block text-sm font-medium text-foreground">
            评论内容 <span className="text-destructive">*</span>
          </label>
          <Textarea
            id="comment-content"
            value={form.content}
            onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
            placeholder="写下你的评论..."
            rows={4}
            aria-invalid={!!formErrors.content}
            aria-describedby={formErrors.content ? "content-error" : undefined}
          />
          {formErrors.content && (
            <p id="content-error" className="mt-1 text-xs text-destructive">
              {formErrors.content}
            </p>
          )}
        </div>

        {replyTo && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Reply className="h-4 w-4" />
            回复 <span className="font-medium text-primary">@{replyTo.nickname}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setReplyTo(null)}
              className="h-auto px-2 py-1 text-xs"
            >
              取消
            </Button>
          </div>
        )}

        <Button
          type="submit"
          disabled={submitting}
          className="cursor-pointer"
        >
          <Send className="mr-2 h-4 w-4" />
          {submitting ? "提交中..." : "发表评论"}
        </Button>
      </form>

      <div className="mt-8">
        {loading ? (
          <Loading text="加载评论中..." />
        ) : error ? (
          <ErrorState title="评论加载失败" message={error} onRetry={fetchComments} />
        ) : list.length === 0 ? (
          <div className="rounded-md border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
            暂无评论，快来发表第一条评论吧
          </div>
        ) : (
          <ul className="space-y-5">
            {topComments.map((comment) => (
              <li key={comment.id}>
                <CommentItem
                  comment={comment}
                  replies={replies.filter((r) => r.parent_id === comment.id)}
                  onReply={setReplyTo}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function CommentItem({
  comment,
  replies,
  onReply,
  nested = false,
}: {
  comment: Comment;
  replies: Comment[];
  onReply: (c: Comment) => void;
  nested?: boolean;
}) {
  return (
    <div className={`${nested ? "ml-10 mt-4 border-l border-border pl-4" : ""}`}>
      <div className="flex gap-3">
        <Avatar className="h-9 w-9 border border-border">
          <AvatarFallback className="bg-muted text-xs font-medium text-primary">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-foreground">{comment.nickname}</span>
            {comment.is_blogger && (
              <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
                博主
              </span>
            )}
            <time className="text-xs text-muted-foreground">
              {format(new Date(comment.created_at), "yyyy-MM-dd HH:mm", { locale: zhCN })}
            </time>
          </div>
          <p className="mt-2 whitespace-pre-wrap text-sm text-foreground">{comment.content}</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onReply(comment)}
            className="mt-2 h-auto px-0 py-1 text-xs text-muted-foreground hover:text-primary"
          >
            <Reply className="mr-1 h-3 w-3" />
            回复
          </Button>
        </div>
      </div>

      {replies.length > 0 && (
        <div className="mt-3">
          {replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} replies={[]} onReply={onReply} nested />
          ))}
        </div>
      )}
    </div>
  );
}
