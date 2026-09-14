import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { blogger, Blogger } from "@/lib/api";

function timeoutSignal(ms = 3000) {
  return AbortSignal.timeout(ms);
}

async function fetchBlogger(): Promise<Blogger | null> {
  try {
    return await blogger.get({ signal: timeoutSignal() });
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchBlogger();
  const title = data?.blog_title ?? "摄影作品集";
  const description = data?.blog_description ?? data?.bio ?? "摄影作品集与视觉博客";
  return {
    title: { default: title, template: `%s · ${title}` },
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const data = await fetchBlogger();

  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {/* 部署端注入的运行时配置（同域部署时该文件不存在，静默忽略） */}
        <Script src="/theme-config.js" strategy="beforeInteractive" />
        <Navbar blogger={data} />
        <main className="min-h-screen">{children}</main>
        <Footer blogger={data} />
      </body>
    </html>
  );
}
