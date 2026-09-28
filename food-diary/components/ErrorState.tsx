"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

/** 列表取数失败时的错误态，支持点击重试 */
export function ErrorState({
  title = "加载失败",
  message = "网络开小差了，请稍后重试",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-accent/30 bg-accent-subtle">
        <AlertCircle className="h-7 w-7 text-accent" strokeWidth={1.5} aria-hidden="true" />
      </div>
      <div>
        <p className="font-display text-lg text-text-primary">{title}</p>
        <p className="mt-1.5 text-sm text-text-muted">{message}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-border bg-surface px-6 text-sm font-medium text-text-secondary shadow-card transition-colors duration-200 ease-out hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <RefreshCw className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
          重新加载
        </button>
      )}
    </div>
  );
}

interface ListEmptyStateProps {
  message: string;
}

/** 列表为空时的虚线空状态 */
export function ListEmptyState({ message }: ListEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border-strong py-16 text-center">
      <p className="font-hand text-2xl text-text-subtle">nothing here yet…</p>
      <p className="text-sm text-text-muted">{message}</p>
    </div>
  );
}
