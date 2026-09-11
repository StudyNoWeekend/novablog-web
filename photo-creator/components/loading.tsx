"use client";

export function HeroSkeleton() {
  return (
    <section className="relative min-h-screen w-full animate-pulse bg-muted">
      <div className="absolute inset-0 bg-background" />
      <div className="relative z-10 flex min-h-screen flex-col justify-between px-4 pb-10 pt-24 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-muted-foreground/20" />
          <div className="hidden space-y-1 sm:block">
            <div className="h-3 w-24 rounded bg-muted-foreground/20" />
            <div className="h-2 w-16 rounded bg-muted-foreground/20" />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-8">
          <div className="space-y-4 text-center">
            <div className="mx-auto h-12 w-64 rounded-lg bg-muted-foreground/20 sm:w-80" />
            <div className="mx-auto h-12 w-56 rounded-lg bg-muted-foreground/20 sm:w-72" />
          </div>
          <div className="flex items-center gap-4">
            <div className="size-14 rounded-full border border-muted-foreground/20" />
            <div className="h-4 w-40 rounded bg-muted-foreground/20" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <div className="size-9 rounded-full bg-muted-foreground/20" />
            <div className="size-9 rounded-full bg-muted-foreground/20" />
            <div className="size-9 rounded-full bg-muted-foreground/20" />
          </div>
          <div className="h-6 w-32 rounded bg-muted-foreground/20" />
        </div>
      </div>
    </section>
  );
}

export function CinematicHeroSkeleton() {
  return <HeroSkeleton />;
}

export function AboutSkeleton() {
  return (
    <section className="animate-pulse bg-background py-20 md:py-28 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div className="aspect-[3/4] w-full bg-muted sm:aspect-[4/5]" />
        <div className="flex flex-col justify-center space-y-6">
          <div className="h-3 w-24 rounded bg-muted" />
          <div className="h-10 w-48 rounded-lg bg-muted" />
          <div className="space-y-3">
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-2/3 rounded bg-muted" />
          </div>
          <div className="grid grid-cols-3 gap-4 border-y border-border py-6">
            <div className="space-y-2">
              <div className="mx-auto h-10 w-16 rounded bg-muted sm:mx-0" />
              <div className="mx-auto h-3 w-20 rounded bg-muted sm:mx-0" />
            </div>
            <div className="space-y-2">
              <div className="mx-auto h-10 w-16 rounded bg-muted sm:mx-0" />
              <div className="mx-auto h-3 w-20 rounded bg-muted sm:mx-0" />
            </div>
            <div className="space-y-2">
              <div className="mx-auto h-10 w-16 rounded bg-muted sm:mx-0" />
              <div className="mx-auto h-3 w-20 rounded bg-muted sm:mx-0" />
            </div>
          </div>
          <div className="h-10 w-44 rounded-full bg-muted" />
        </div>
      </div>
    </section>
  );
}

export function PortfolioWallSkeleton({ count = 6 }: { count?: number }) {
  return (
    <section className="animate-pulse bg-background py-20 md:py-28 lg:py-32">
      <div className="mx-auto mb-10 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-3 w-32 rounded bg-muted" />
        <div className="mt-2 h-10 w-64 rounded-lg bg-muted" />
      </div>
      <div
        className="flex gap-4 overflow-hidden px-4 sm:gap-6 sm:px-6 lg:gap-8 lg:px-8"
        style={{ scrollbarWidth: "none" }}
      >
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="h-[70vh] w-[85vw] flex-shrink-0 bg-muted sm:w-[60vw] md:w-[45vw] lg:h-[78vh] lg:w-[clamp(360px,28vw,460px)]"
          />
        ))}
      </div>
    </section>
  );
}

export function JournalSkeleton({ count = 3 }: { count?: number }) {
  return (
    <section className="animate-pulse bg-background py-20 md:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="h-3 w-24 rounded bg-muted" />
            <div className="mt-2 h-10 w-64 rounded-lg bg-muted" />
          </div>
          <div className="h-4 w-20 rounded bg-muted" />
        </div>
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
          <div className="space-y-4">
            <div className="aspect-[4/3] w-full bg-muted" />
            <div className="h-3 w-20 rounded bg-muted" />
            <div className="h-8 w-3/4 rounded-lg bg-muted" />
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-muted" />
              <div className="h-4 w-2/3 rounded bg-muted" />
            </div>
          </div>
          <div className="flex flex-col gap-4 sm:gap-6">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="flex gap-4 border-b border-border pb-4 sm:gap-5 sm:pb-6">
                <div className="aspect-square w-24 flex-shrink-0 bg-muted sm:w-28" />
                <div className="flex flex-1 flex-col justify-center gap-2">
                  <div className="h-3 w-16 rounded bg-muted" />
                  <div className="h-5 w-full rounded bg-muted" />
                  <div className="h-4 w-2/3 rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function PortfolioGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="aspect-[4/3] w-full bg-muted" />
          <div className="space-y-3 p-5">
            <div className="h-5 w-2/3 rounded-md bg-muted" />
            <div className="h-4 w-1/2 rounded-md bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ArticleGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="aspect-[16/10] w-full bg-muted" />
          <div className="space-y-3 p-5">
            <div className="h-5 w-3/4 rounded-md bg-muted" />
            <div className="h-4 w-full rounded-md bg-muted" />
            <div className="h-4 w-2/3 rounded-md bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ArticleDetailSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="aspect-[21/9] w-full bg-muted md:aspect-[21/8]" />
      <div className="mx-auto max-w-3xl space-y-6 px-4">
        <div className="h-8 w-3/4 rounded-lg bg-muted" />
        <div className="flex gap-4">
          <div className="h-4 w-20 rounded-md bg-muted" />
          <div className="h-4 w-24 rounded-md bg-muted" />
        </div>
        <div className="space-y-3">
          <div className="h-4 w-full rounded-md bg-muted" />
          <div className="h-4 w-full rounded-md bg-muted" />
          <div className="h-4 w-2/3 rounded-md bg-muted" />
        </div>
      </div>
    </div>
  );
}
