import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageTransition } from "@/components/PageTransition";
import { MusicPlayerProvider } from "@/components/MusicPlayerProvider";
import { getBloggerProfile } from "@/lib/api/blogger";
import { getModuleConfig } from "@/lib/api/module-config";

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const profile = await getBloggerProfile();

    return {
      title: profile?.blog_title || "Lens & Life | 林远舟的摄影博客",
      description:
        profile?.blog_description ||
        "用镜头收藏世界的边角与光芒。风光、城市、人文与航拍作品，以及摄影教程与器材分享。",
      keywords: ["摄影博客", "风光摄影", "城市摄影", "人文摄影", "航拍", "摄影教程"],
      icons: profile?.blog_icon ? { icon: profile.blog_icon } : undefined,
    };
  } catch {
    return {
      title: "Lens & Life | 林远舟的摄影博客",
      description:
        "用镜头收藏世界的边角与光芒。风光、城市、人文与航拍作品，以及摄影教程与器材分享。",
      keywords: ["摄影博客", "风光摄影", "城市摄影", "人文摄影", "航拍", "摄影教程"],
    };
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const modules = await getModuleConfig();
  const profile = await getBloggerProfile();

  return (
    <html lang="zh-CN" className="dark">
      <body
        className={`${playfair.variable} min-h-screen bg-background text-text-primary antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          <MusicPlayerProvider>
            <Navbar modules={modules} />
            <main className="flex flex-1 flex-col">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer profile={profile} />
          </MusicPlayerProvider>
        </div>
      </body>
    </html>
  );
}
