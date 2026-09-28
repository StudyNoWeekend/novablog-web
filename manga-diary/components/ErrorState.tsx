"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { CatFace } from "@/components/ComicDoodle";

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
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-dashed border-border-strong bg-surface">
        <AlertCircle className="h-6 w-6 text-tomato" strokeWidth={1.5} aria-hidden="true" />
      </div>
      <div>
        <p className="font-display text-base text-text-primary">{title}</p>
        <p className="mt-1.5 text-sm text-text-muted">{message}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-border bg-surface px-6 text-sm font-medium text-text-secondary transition-colors duration-200 ease-out hover:border-accent hover:text-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
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
    <div className="flex flex-col items-center rounded-radius-md border border-dashed border-border-strong bg-surface/60 py-16 text-center">
      <CatFace className="h-12 w-12 -rotate-6 text-text-subtle" />
      <p className="mt-4 px-4 text-sm text-text-muted">{message}</p>
    </div>
  );
}
