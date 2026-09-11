import type { Metadata } from "next";
import "./lens-life.css";
import { LensLifeNavbar } from "@/components/lens-life/navbar";
import { LensLifeFooter } from "@/components/lens-life/footer";

export const metadata: Metadata = {
  title: { default: "Lens & Life", template: "%s · Lens & Life" },
  description: "摄影 | 旅行 | 生活 — Kane Lee 的视觉日志",
};

export default function LensLifeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="dark lens-life-theme min-h-screen bg-background text-foreground">
      <LensLifeNavbar />
      <main className="min-h-screen">{children}</main>
      <LensLifeFooter />
    </div>
  );
}
