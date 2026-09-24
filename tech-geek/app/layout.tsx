import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MusicPlayerProvider } from "@/components/music-player-provider";
import { FloatingPlayer } from "@/components/floating-player";
import { blogger, getModuleConfig, Blogger } from "@/lib/api";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const FALLBACK_TITLE = "Tech Geek Blog";
const FALLBACK_DESCRIPTION =
  "面向开发者与硬核技术读者的技术博客，记录代码、架构与技术思考。";

async function fetchBloggerSafe(): Promise<Blogger | null> {
  try {
    return await blogger.get();
  } catch {
    // 构建期后端不可达时回退默认值，保证静态导出构建不失败
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const profile = await fetchBloggerSafe();
  const title = profile?.blog_title || FALLBACK_TITLE;
  const description = profile?.blog_description || FALLBACK_DESCRIPTION;

  return {
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description,
    keywords: ["技术博客", "开发者", "代码", "编程", "架构"],
    authors: profile?.nickname ? [{ name: profile.nickname }] : undefined,
    icons: profile?.blog_icon ? { icon: profile.blog_icon } : undefined,
    openGraph: {
      type: "website",
      locale: "zh_CN",
      siteName: title,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/** 亮色为默认；localStorage 记忆优先，其次跟随系统，避免首帧闪烁 */
const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.classList.add("dark");}}catch(e){}})();`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [profile, modules] = await Promise.all([
    fetchBloggerSafe(),
    getModuleConfig(),
  ]);

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background font-sans antialiased`}
      >
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        {/* 部署端注入的运行时配置（同域部署时该文件不存在，静默忽略） */}
        <Script src="/theme-config.js" strategy="beforeInteractive" />
        <div className="flex min-h-screen flex-col">
          <MusicPlayerProvider>
            <Navbar initialModules={modules} initialProfile={profile} />
            <main className="flex-1">{children}</main>
            <Footer initialProfile={profile} />
            <FloatingPlayer />
          </MusicPlayerProvider>
        </div>
      </body>
    </html>
  );
}
