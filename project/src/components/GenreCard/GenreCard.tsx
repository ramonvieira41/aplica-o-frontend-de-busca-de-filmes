import { Link } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';
import type { GenreInfo } from '@/types';

interface GenreCardProps {
  genre: GenreInfo;
}

export function GenreCard({ genre }: GenreCardProps) {
  return (
    <Link
      to="/genres/$genre"
      params={{ genre: genre.id }}
      className="group relative flex flex-col justify-end overflow-hidden rounded-xl border border-base-200 bg-base-100 p-5 transition-all hover:border-primary-500 hover:shadow-md dark:border-base-800 dark:bg-base-900 focus-ring"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent transition-opacity group-hover:opacity-100" />
      <div className="relative z-10">
        <h3 className="text-lg font-bold font-display text-base-900 transition-colors group-hover:text-primary-600 dark:text-base-100 dark:group-hover:text-primary-400">
          {genre.label}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-base-500 dark:text-base-400">
          {genre.description}
        </p>
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary-600 dark:text-primary-400">
          Explorar
          <ChevronRight size={16} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
