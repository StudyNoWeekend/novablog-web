"use client";

import { CloudOff, RotateCcw } from "lucide-react";

interface ErrorStateProps {
  title: string;
  message?: string;
  onRetry?: () => void;
}

/** 列表加载失败占位：错误信息 + 重试按钮（media-creator 圆角卡片风格） */
export function ErrorState({ title, message, onRetry }: ErrorStateProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-12 text-center">
      <CloudOff className="mx-auto h-12 w-12 text-muted-foreground/50" />
      <h2 className="mt-4 text-lg font-semibold text-destructive">{title}</h2>
      {message && <p className="mt-2 text-sm text-muted-foreground">{message}</p>}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring"
        >
          <RotateCcw className="h-4 w-4" />
          重新加载
        </button>
      )}
    </div>
  );
}
