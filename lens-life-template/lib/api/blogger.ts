import { apiFetch } from "./client";

export interface SocialLink {
  platform: string;
  url: string;
  sort_order: number;
  name?: string;
  icon?: string;
  color?: string;
}

export interface BloggerProfile {
  nickname: string;
  avatar: string;
  bio: string;
  blog_title: string;
  blog_description: string;
  page_background: string;
  blog_icon: string;
  email?: string;
  city?: string;
  tags?: string[];
  social_links: SocialLink[];
}

export async function getBloggerProfile(): Promise<BloggerProfile | null> {
  try {
    return await apiFetch<BloggerProfile>("/public/blogger");
  } catch (error) {
    console.error("Failed to fetch blogger profile:", error);
    return null;
  }
}
