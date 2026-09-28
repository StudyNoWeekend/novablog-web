import type { Metadata } from "next";
import { RecipesListPage } from "@/components/recipes-list-page";

export const metadata: Metadata = {
  title: "美食菜谱",
  description: "一日三餐的记录，认真做饭，好好吃饭。",
};

export default function Page() {
  return <RecipesListPage />;
}
