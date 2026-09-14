import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Tech Geek Blog",
    template: "%s | Tech Geek Blog",
  },
  description: "面向开发者与硬核技术读者的深色终端风格博客，记录代码、架构与技术思考。",
  keywords: ["技术博客", "开发者", "代码", "编程", "架构"],
  authors: [{ name: "Tech Geek" }],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "Tech Geek Blog",
    title: "Tech Geek Blog",
    description: "面向开发者与硬核技术读者的深色终端风格博客。",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tech Geek Blog",
    description: "面向开发者与硬核技术读者的深色终端风格博客。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background font-sans antialiased`}
      >
        {/* 部署端注入的运行时配置（同域部署时该文件不存在，静默忽略） */}
        <Script src="/theme-config.js" strategy="beforeInteractive" />
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
