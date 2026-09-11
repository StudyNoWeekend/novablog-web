interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function LensLifeArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <h1 className="text-center text-3xl font-semibold text-foreground">
        文章详情：{slug}
      </h1>
    </div>
  );
}
