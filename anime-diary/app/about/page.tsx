import { Heart } from "lucide-react";
import { AboutContent } from "@/components/AboutContent";

export const metadata = {
  title: "关于我",
};

export default function AboutPage() {
  return (
    <div className="flex flex-1 flex-col bg-background">
      {/* Page Header */}
      <section className="border-b border-border bg-gradient-to-br from-background-soft via-accent-subtle to-lav-subtle py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="flex items-center justify-center gap-3 font-heading text-4xl text-text-primary md:text-5xl">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-subtle">
              <Heart className="h-6 w-6 fill-accent text-accent" strokeWidth={1.5} />
            </span>
            关于我
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-text-muted">
            About Me · 一起把喜欢的东西，变成更有意义的生活吧
          </p>
        </div>
      </section>

      <AboutContent />
    </div>
  );
}
