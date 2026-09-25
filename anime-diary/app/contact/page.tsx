import { Mail } from "lucide-react";
import { ContactContent } from "@/components/ContactContent";

export const metadata = {
  title: "联系",
};

export default function ContactPage() {
  return (
    <div className="flex flex-1 flex-col bg-background">
      {/* Page Header */}
      <section className="border-b border-border bg-gradient-to-br from-sky-subtle via-background-soft to-accent-subtle py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="flex items-center justify-center gap-3 font-heading text-4xl text-text-primary md:text-5xl">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-subtle">
              <Mail className="h-6 w-6 text-accent" strokeWidth={1.5} />
            </span>
            联系我
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-text-muted">
            Contact · 欢迎来找我玩～
          </p>
        </div>
      </section>

      <ContactContent />
    </div>
  );
}
