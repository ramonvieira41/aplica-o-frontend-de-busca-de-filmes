import { Link } from '@tanstack/react-router';
import { Play, Star, } from 'lucide-react';
import type { Movie } from '@/types';
import { formatDuration, formatDate, formatRating } from '@/utils/format';

interface HeroProps {
  movie: Movie;
}

export function Hero({ movie }: HeroProps) {
  return (
    <section className="relative h-[70vh] min-h-[480px] w-full overflow-hidden">
      {movie.backdropUrl && (
        <img
          src={movie.backdropUrl}
          alt={`Cena do filme ${movie.title}`}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-base-50 via-base-50/40 to-transparent dark:from-base-950 dark:via-base-950/50" />
      <div className="absolute inset-0 bg-gradient-to-r from-base-50/80 via-transparent to-transparent dark:from-base-950/80" />

      <div className="relative z-10 flex h-full items-end">
        <div className="mx-auto w-full max-w-screen-2xl px-4 pb-10 sm:px-6 lg:px-8 lg:pb-16">
          <div className="max-w-2xl animate-fade-up">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-500/20 px-3 py-1 text-xs font-semibold text-primary-600 dark:text-primary-400">
              <Star size={12} className="fill-current" /> Em Destaque
            </span>
            <h1 className="mt-4 text-4xl font-bold font-display tracking-tight text-base-900 drop-shadow-sm dark:text-base-50 sm:text-5xl lg:text-6xl">
              {movie.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-base-600 dark:text-base-300">
              <span className="inline-flex items-center gap-1 font-semibold text-accent-600 dark:text-accent-400">
                <Star size={14} className="fill-current" /> {formatRating(movie.rating)}
              </span>
              {movie.releaseDate && (
                <>
                  <span aria-hidden>·</span>
                  <span>{formatDate(movie.releaseDate)}</span>
                </>
              )}
              {movie.durationMinutes > 0 && (
                <>
                  <span aria-hidden>·</span>
                  <span>{formatDuration(movie.durationMinutes)}</span>
                </>
              )}
              {movie.genreNames.length > 0 && (
                <>
                  <span aria-hidden>·</span>
                  <span>{movie.genreNames.join(', ')}</span>
                </>
              )}
            </div>
            <p className="mt-4 line-clamp-3 text-base text-base-700 dark:text-base-200 sm:text-lg">
              {movie.synopsis}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/movie/$id"
                params={{ id: movie.id }}
                className="inline-flex items-center gap-2 rounded-xl bg-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-primary-600 focus-ring"
              >
                <Play size={18} className="fill-current" /> Ver Detalhes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
