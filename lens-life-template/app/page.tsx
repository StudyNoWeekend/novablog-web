import Image from "next/image";
import Link from "next/link";
import { Images } from "lucide-react";
import { ArticleCard } from "@/components/ArticleCard";
import { EquipmentCard } from "@/components/EquipmentCard";
import { HeroSection } from "@/components/HeroSection";
import { getBloggerProfile } from "@/lib/api/blogger";
import { getArticles } from "@/lib/api/articles";
import { getEquipments } from "@/lib/api/equipments";
import { getPortfolios } from "@/lib/api/portfolios";
import { getModuleConfig } from "@/lib/api/module-config";


export default async function HomePage() {
  const [profile, articlesData, moduleConfig, equipmentsData, portfoliosData] =
    await Promise.all([
      getBloggerProfile(),
      getArticles({ page: 1, page_size: 4 }),
      getModuleConfig(),
      getEquipments({ page: 1, page_size: 5 }),
      getPortfolios({ page: 1, page_size: 5 }),
    ]);

  const latestArticles = articlesData.list;
  const equipments = equipmentsData.list;
  const portfolioPreview = portfoliosData.list;

  return (
    <div className="flex flex-1 flex-col">
      {/* Hero Section */}
      <HeroSection profile={profile} />

      {/* Latest Articles Section */}
      {moduleConfig.article_enabled && latestArticles.length > 0 && (
        <section className="bg-background py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex items-end justify-between">
              <h2 className="font-[var(--font-playfair)] text-2xl font-bold text-text-primary md:text-3xl">
                最新文章
              </h2>
              <Link
                href="/articles"
                className="flex cursor-pointer items-center gap-1 text-sm font-medium text-text-muted transition-colors duration-200 ease-out hover:text-accent"
              >
                查看全部文章
                <span>&gt;</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {latestArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Equipment Section */}
      {moduleConfig.equipment_enabled && equipments.length > 0 && (
        <section className="bg-background-soft py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex items-end justify-between">
              <h2 className="font-[var(--font-playfair)] text-2xl font-bold text-text-primary md:text-3xl">
                器材
              </h2>
              <Link
                href="/gear"
                className="flex cursor-pointer items-center gap-1 text-sm font-medium text-text-muted transition-colors duration-200 ease-out hover:text-accent"
              >
                查看全部器材
                <span>&gt;</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {equipments.map((equipment) => (
                <EquipmentCard key={equipment.id} equipment={equipment} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Portfolio Preview Section */}
      {moduleConfig.portfolio_enabled && portfolioPreview.length > 0 && (
        <section className="bg-background py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex items-end justify-between">
              <h2 className="font-[var(--font-playfair)] text-2xl font-bold text-text-primary md:text-3xl">
                作品集
              </h2>
              <Link
                href="/portfolio"
                className="flex cursor-pointer items-center gap-1 text-sm font-medium text-text-muted transition-colors duration-200 ease-out hover:text-accent"
              >
                查看全部作品集
                <span>&gt;</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {portfolioPreview.map((portfolio) => (
                <Link
                  key={portfolio.id}
                  href="/portfolio"
                  className="group relative aspect-[4/5] cursor-pointer overflow-hidden rounded-radius-md bg-surface"
                >
                  {portfolio.cover_url ? (
                    <Image
                      src={portfolio.cover_url}
                      alt={portfolio.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                      className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Images
                        className="h-8 w-8 text-text-subtle"
                        strokeWidth={1.5}
                      />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100" />
                  <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100">
                    <h3 className="font-[var(--font-playfair)] text-base font-semibold text-text-primary">
                      {portfolio.name}
                    </h3>
                    <p className="mt-1 text-xs text-text-muted">
                      {portfolio.item_count} 张作品
                      {portfolio.category_name
                        ? ` · ${portfolio.category_name}`
                        : ""}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
