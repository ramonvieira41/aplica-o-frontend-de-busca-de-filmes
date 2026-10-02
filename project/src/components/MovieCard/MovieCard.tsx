import { Link } from '@tanstack/react-router';
import { Heart, Play } from 'lucide-react';
import type { Movie } from '@/types';
import { useFavorites } from '@/hooks/useFavorites';
import { formatDuration } from '@/utils/format';
import { RatingBadge } from '@/components/RatingBadge';

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(movie.id);

  return (
    <Link
      to="/movie/$id"
      params={{ id: movie.id }}
      className="group block focus-ring rounded-xl"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-base-200 dark:bg-base-800">
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={`Pôster do filme ${movie.title}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-base-400">
            <Play size={28} />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="absolute top-2 right-2 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(movie.id);
            }}
            aria-label={fav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70 focus-ring"
          >
            <Heart
              size={18}
              className={fav ? 'fill-red-500 text-red-500' : ''}
            />
          </button>
        </div>

        <div className="absolute bottom-2 left-2 z-10">
          <RatingBadge rating={movie.rating} />
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-base-900 shadow-lg">
            <Play size={20} className="fill-current" />
          </span>
        </div>
      </div>

      <div className="mt-2.5 px-0.5">
        <h3 className="truncate text-sm font-semibold text-base-900 transition-colors group-hover:text-primary-600 dark:text-base-100 dark:group-hover:text-primary-400">
          {movie.title}
        </h3>
        <div className="mt-1 flex items-center gap-1.5 text-xs text-base-500 dark:text-base-400">
          <span className="truncate">{movie.genreNames.join(', ')}</span>
          {movie.durationMinutes > 0 && (
            <>
              <span aria-hidden>·</span>
              <span>{formatDuration(movie.durationMinutes)}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
