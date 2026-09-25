"use client";

import type { ReactNode } from "react";

/** 路由切换淡入动画（纯客户端视觉，无阻塞逻辑） */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <div key="page-transition" className="page-transition animate-page-fade-in">
      {children}
    </div>
  );
}
