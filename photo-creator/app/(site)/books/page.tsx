import type { Metadata } from "next";
import { BooksListPage } from "@/components/books-list-page";

export const metadata: Metadata = {
  title: "读书书架",
  description: "读过的、在读的、想读的书，都在这里。",
};

export default function Page() {
  return <BooksListPage />;
}
