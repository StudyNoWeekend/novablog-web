import Image from "next/image";
import Link from "next/link";
import { Gamepad2 } from "lucide-react";
import type { GameEntry } from "@/lib/types";

interface GameCardProps {
  game: GameEntry;
}

export function GameCard({ game }: GameCardProps) {
  return (
    <Link
      href={`/games/${game.id}`}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-radius-md border border-border bg-surface shadow-card transition-all duration-300 ease-out hover:-translate-y-1 hover:border-accent/40 hover:shadow-card-hover"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {game.image_url ? (
          <Image
            src={game.image_url}
            alt={game.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-surface-elevated to-background-soft text-text-subtle">
            <Gamepad2 className="h-8 w-8" strokeWidth={1.5} />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        {game.brand && (
          <span className="mb-2 w-fit rounded-full bg-accent-subtle px-2.5 py-0.5 text-xs font-semibold text-accent-hover">
            {game.brand}
          </span>
        )}
        <h3 className="line-clamp-1 font-heading text-lg font-bold text-text-primary transition-colors duration-200 ease-out group-hover:text-accent-hover">
          {game.name}
        </h3>
        {game.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-text-muted">
            {game.description}
          </p>
        )}
      </div>
    </Link>
  );
}
