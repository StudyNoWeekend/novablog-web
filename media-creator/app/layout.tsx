import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Ma_Shan_Zheng } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { blogger } from "@/lib/api";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 中文手写字体，用于 Hero 关键词与批注点缀（自托管，构建期内联）
const handWriting = Ma_Shan_Zheng({
  variable: "--font-hand-writing",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const info = await blogger.get().catch(() => null);
  const blogTitle = info?.blog_title || "Media Creator Blog";
  return {
    title: {
      default: blogTitle,
      template: info?.blog_title ? `%s | ${info.blog_title}` : "%s",
    },
    description:
      info?.blog_description ||
      "视频创作者的内容主页，分享视频作品、文章动态与创作生活。",
    icons: info?.blog_icon ? { icon: info.blog_icon } : undefined,
    openGraph: {
      title: blogTitle,
      description: info?.blog_description || "视频创作者的内容主页",
      type: "website",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        {/* 主题偏好恢复：在首帧绘制前执行，避免明暗切换闪烁 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(localStorage.getItem("theme")==="light"){document.documentElement.classList.add("light")}}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${handWriting.variable} antialiased min-h-screen flex flex-col`}
      >
        {/* 部署端注入的运行时配置（同域部署时该文件不存在，静默忽略） */}
        <Script src="/theme-config.js" strategy="beforeInteractive" />
        <Navbar />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
