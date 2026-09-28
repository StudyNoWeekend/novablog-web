import type { Metadata } from "next";
import { FitnessListPage } from "@/components/fitness-list-page";

export const metadata: Metadata = {
  title: "健身训练",
  description: "每一次训练，都是与自己的对话。",
};

export default function Page() {
  return <FitnessListPage />;
}
