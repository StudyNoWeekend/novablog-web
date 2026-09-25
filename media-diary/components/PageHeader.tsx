interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

/** 内页统一页头：奶油纸底 + 手写体标题 + 黄色波浪线（对应 UI 图区块标题风格） */
export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <section className="bg-surface-highlight py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl text-text-primary md:text-4xl">
          <span className="squiggle inline-block">{title}</span>
        </h1>
        {subtitle && (
          <p className="mt-4 text-sm text-text-muted md:text-base">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
