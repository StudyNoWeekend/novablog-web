"use client";

import { useEffect, useState } from "react";
import { ListMusic } from "lucide-react";
import { PlaylistCard } from "@/components/PlaylistCard";
import { getPlaylists } from "@/lib/api/music";
import type { Playlist } from "@/lib/types";

export function PlaylistsContent() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getPlaylists().then((list) => {
      if (cancelled) return;
      setPlaylists(list);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex flex-1 flex-col">
      {/* Page header */}
      <section className="border-b border-border bg-background-soft py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-text-primary md:text-4xl">歌单</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-text-muted md:text-base">
            精心整理的第三方歌单，点击卡片跳转到对应平台收听。
          </p>
        </div>
      </section>

      {/* Playlist grid */}
      <section className="flex-1 py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse overflow-hidden rounded-xl bg-surface">
                  <div className="aspect-square bg-surface-elevated" />
                  <div className="space-y-2 p-4">
                    <div className="h-4 w-2/3 rounded bg-surface-elevated" />
                    <div className="h-3 w-full rounded bg-surface-elevated" />
                  </div>
                </div>
              ))}
            </div>
          ) : playlists.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-surface/50 px-6 py-16 text-center">
              <ListMusic className="mx-auto h-10 w-10 text-text-subtle" strokeWidth={1.5} />
              <p className="mt-4 text-sm text-text-muted">还没有创建歌单，敬请期待</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {playlists.map((playlist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
