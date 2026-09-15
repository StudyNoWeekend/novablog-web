"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getBloggerProfile } from "@/lib/api/blogger";
import type { BloggerProfile } from "@/lib/api/blogger";
import {
  Mail,
  MapPin,
  Instagram,
  Send,
  Loader2,
  CheckCircle2,
  User,
  AtSign,
  MessageSquare,
} from "lucide-react";

const DEFAULT_EMAIL = "hello@lenslife.blog";
const DEFAULT_PHOTOGRAPHER_NAME = "博主";
const DEFAULT_PHOTOGRAPHER_TAGLINE = "用镜头收藏世界的边角与光芒";

interface FormState {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const initialForm: FormState = { name: "", email: "", message: "" };

function SocialLinkItem({ platform, url }: { platform: string; url: string }) {
  const isInstagram = platform.toLowerCase() === "instagram";

  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={platform}
      className="group flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-radius-md border border-border bg-surface px-4 py-2.5 text-sm font-medium text-text-muted transition-all duration-200 ease-out hover:border-accent hover:bg-accent-subtle hover:text-accent"
    >
      {isInstagram ? (
        <Instagram className="h-4 w-4" strokeWidth={1.5} />
      ) : (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-subtle text-xs text-accent">
          {platform.slice(0, 1)}
        </span>
      )}
      <span>{platform}</span>
    </Link>
  );
}

export default function ContactPage() {
  const [profile, setProfile] = useState<BloggerProfile | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    getBloggerProfile().then(setProfile);
  }, []);

  // Social links from API only
  const socialLinks = profile?.social_links?.length
    ? profile.social_links.map((s) => ({
        platform: s.name || s.platform,
        url: s.url,
      }))
    : [];

  const avatar = profile?.avatar;
  const name = profile?.nickname || DEFAULT_PHOTOGRAPHER_NAME;
  const tagline =
    profile?.bio
      ? profile.bio.length > 30
        ? `${profile.bio.slice(0, 30)}...`
        : profile.bio
      : DEFAULT_PHOTOGRAPHER_TAGLINE;

  const validate = (): boolean => {
    const nextErrors: FormErrors = {};
    if (!form.name.trim()) nextErrors.name = "请输入姓名";
    if (!form.email.trim()) {
      nextErrors.email = "请输入邮箱";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "请输入有效的邮箱地址";
    }
    if (!form.message.trim()) nextErrors.message = "请输入留言内容";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    // No real contact API yet — simulate a short delay
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsSubmitting(false);
    setIsSuccess(true);
    setForm(initialForm);
    setErrors({});
  };

  const handleReset = () => {
    setIsSuccess(false);
    setForm(initialForm);
    setErrors({});
  };

  return (
    <div className="flex flex-1 flex-col">
      <section className="border-b border-border bg-background-soft py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="font-[var(--font-playfair)] text-3xl font-medium italic text-text-primary sm:text-4xl">
            联系我
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-text-muted" />
        </div>
      </section>

      <section className="flex-1 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            {/* Contact form */}
            <div className="rounded-radius-lg border border-border bg-surface p-6 shadow-card sm:p-8">
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle2 className="h-12 w-12 text-accent" strokeWidth={1.5} />
                  <h3 className="mt-4 text-xl font-medium text-text-primary">
                    消息已发送
                  </h3>
                  <p className="mt-2 max-w-sm text-text-muted">
                    感谢你的来信，我会尽快回复。
                  </p>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="mt-6 cursor-pointer rounded-radius-sm bg-accent px-5 py-2.5 text-sm font-medium text-black transition-colors duration-200 ease-out hover:bg-accent-hover"
                  >
                    继续留言
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 flex items-center gap-2 text-sm font-medium text-text-primary"
                    >
                      <User className="h-4 w-4 text-text-muted" strokeWidth={1.5} />
                      姓名
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="怎么称呼你"
                      className="w-full rounded-radius-md border border-border bg-background px-4 py-3 text-text-primary placeholder:text-text-subtle transition-colors duration-200 ease-out focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-400">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 flex items-center gap-2 text-sm font-medium text-text-primary"
                    >
                      <AtSign className="h-4 w-4 text-text-muted" strokeWidth={1.5} />
                      邮箱
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="w-full rounded-radius-md border border-border bg-background px-4 py-3 text-text-primary placeholder:text-text-subtle transition-colors duration-200 ease-out focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-400">{errors.email}</p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="mb-2 flex items-center gap-2 text-sm font-medium text-text-primary"
                    >
                      <MessageSquare className="h-4 w-4 text-text-muted" strokeWidth={1.5} />
                      留言
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="写下你想说的话..."
                      className="w-full resize-none rounded-radius-md border border-border bg-background px-4 py-3 text-text-primary placeholder:text-text-subtle focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                    {errors.message && (
                      <p className="mt-2 text-sm text-red-400">{errors.message}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-radius-sm bg-accent px-5 py-3 text-sm font-medium text-black transition-colors duration-200 ease-out hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>发送中...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" strokeWidth={1.5} />
                        <span>发送消息</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Contact info card */}
            <div className="rounded-radius-lg border border-border bg-surface p-6 shadow-card sm:p-8">
              <div className="flex items-center gap-4 border-b border-border pb-6">
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border-2 border-border">
                  {avatar ? (
                    <Image
                      src={avatar}
                      alt={name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="h-full w-full bg-background-soft" />
                  )}
                </div>
                <div>
                  <h2 className="font-[var(--font-playfair)] text-xl font-medium italic text-text-primary">
                    {name}
                  </h2>
                  <p className="mt-1 text-sm text-text-muted">{tagline}</p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <a
                  href={`mailto:${profile?.email || DEFAULT_EMAIL}`}
                  className="group flex cursor-pointer items-center gap-4 rounded-radius-md border border-border bg-background p-4 transition-all duration-200 ease-out hover:border-accent"
                >
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent-subtle text-accent">
                    <Mail className="h-4 w-4" strokeWidth={1.5} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs text-text-muted">邮箱</p>
                    <p className="truncate text-sm font-medium text-text-primary transition-colors group-hover:text-accent">
                      {profile?.email || DEFAULT_EMAIL}
                    </p>
                  </div>
                </a>

                {profile?.city && (
                  <div className="flex items-center gap-4 rounded-radius-md border border-border bg-background p-4">
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent-subtle text-accent">
                      <MapPin className="h-4 w-4" strokeWidth={1.5} />
                    </span>
                    <div>
                      <p className="text-xs text-text-muted">所在地</p>
                      <p className="text-sm font-medium text-text-primary">
                        {profile.city}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {socialLinks.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-sm font-medium text-text-primary">社交媒体</h3>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {socialLinks.map((link) => (
                      <SocialLinkItem
                        key={link.platform}
                        platform={link.platform}
                        url={link.url}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}