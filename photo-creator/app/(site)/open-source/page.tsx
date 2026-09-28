import type { Metadata } from "next";
import { OpenSourceListPage } from "@/components/open-source-list-page";

export const metadata: Metadata = {
  title: "开源作品",
  description: "把重复的问题交给代码，这里收录我的开源实践。",
};

export default function Page() {
  return <OpenSourceListPage />;
}
