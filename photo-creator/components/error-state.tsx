"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = "加载失败，请稍后重试", onRetry }: ErrorStateProps) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 py-20 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <AlertCircle className="size-6 text-primary" aria-hidden="true" />
      </div>
      <p className="max-w-md text-base text-foreground/90">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring"
        >
          <RefreshCw className="size-4" aria-hidden="true" />
          重试
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title = "暂无内容", description }: { title?: string; description?: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 px-4 py-20 text-center">
      <p className="text-base font-medium text-foreground">{title}</p>
      {description && <p className="max-w-md text-sm text-muted-foreground">{description}</p>}
    </div>
  );
}
