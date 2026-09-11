import type { Metadata } from "next";
import { HomePage } from "@/components/home-page";

export const metadata: Metadata = {
  title: "首页",
};

export default function Page() {
  return <HomePage />;
}
