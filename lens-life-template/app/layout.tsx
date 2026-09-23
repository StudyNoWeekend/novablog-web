import type { Metadata } from "next";
import Script from "next/script";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageTransition } from "@/components/PageTransition";
import { MusicPlayerProvider } from "@/components/MusicPlayerProvider";
import { FloatingPlayer } from "@/components/FloatingPlayer";
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
    const blogTitle = profile?.blog_title || "";

    return {
      title: {
        default: blogTitle,
        template: blogTitle ? `%s | ${blogTitle}` : "%s",
      },
      description:
        profile?.blog_description || "",
      icons: profile?.blog_icon ? { icon: profile.blog_icon } : undefined,
    };
  } catch {
    return {
      title: {
        default: "",
        template: "%s",
      },
      description: "",
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
        {/* 部署端注入的运行时配置（同域部署时该文件不存在，静默忽略） */}
        <Script src="/theme-config.js" strategy="beforeInteractive" />
        <div className="flex min-h-screen flex-col">
          <MusicPlayerProvider>
            <Navbar modules={modules} />
            <main className="flex flex-1 flex-col">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer profile={profile} />
            <FloatingPlayer />
          </MusicPlayerProvider>
        </div>
      </body>
    </html>
  );
}
