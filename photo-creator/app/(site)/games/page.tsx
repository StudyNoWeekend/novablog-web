import type { Metadata } from "next";
import { GamesListPage } from "@/components/games-list-page";

export const metadata: Metadata = {
  title: "游戏库",
  description: "玩过的游戏与片刻感想。",
};

export default function Page() {
  return <GamesListPage />;
}
