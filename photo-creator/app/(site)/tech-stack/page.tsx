import type { Metadata } from "next";
import { TechStackListPage } from "@/components/tech-stack-list-page";

export const metadata: Metadata = {
  title: "技术栈",
  description: "日常使用的工具与技术，以及熟练程度。",
};

export default function Page() {
  return <TechStackListPage />;
}
