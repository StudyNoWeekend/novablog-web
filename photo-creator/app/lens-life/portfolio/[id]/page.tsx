interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function LensLifePortfolioDetailPage({ params }: PageProps) {
  const { id } = await params;
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <h1 className="text-center text-3xl font-semibold text-foreground">
        作品集详情：{id}
      </h1>
    </div>
  );
}
