import { AboutProfile } from "@/components/AboutProfile";

export const metadata = { title: "关于我" };

export default function AboutPage() {
  // 关于我仅依赖博主资料（公开接口始终可用，客户端运行时取数），无模块开关约束
  return (
    <div className="flex flex-1 flex-col bg-background">
      <AboutProfile />
    </div>
  );
}
