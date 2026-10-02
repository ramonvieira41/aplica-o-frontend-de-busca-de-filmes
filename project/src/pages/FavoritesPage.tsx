import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { movieService } from '@/services/movieService';
import { MovieGrid } from '@/components/MovieGrid';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/Button';
import type { Movie } from '@/types';

export function FavoritesPage() {
  const { favorites, count } = useFavorites();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const result = await movieService.getByIds(favorites);
      if (active) {
        setMovies(result);
        setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [favorites]);

  if (loading) {
    return (
      <div className="flex h-[40vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-base-200 border-t-primary-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-display text-base-900 dark:text-base-100 sm:text-3xl">
          Meus Favoritos
        </h1>
        {count > 0 && (
          <p className="mt-1 text-sm text-base-500 dark:text-base-400">
            {count} {count === 1 ? 'filme favoritado' : 'filmes favoritados'}
          </p>
        )}
      </div>

      {movies.length === 0 ? (
        <EmptyState
          icon={<Heart size={28} />}
          title="Nenhum favorito ainda"
          description="Navegue pelo catálogo e clique no coração para adicionar filmes à sua lista de favoritos."
          action={
            <Link to="/">
              <Button>Explorar catálogo</Button>
            </Link>
          }
        />
      ) : (
        <MovieGrid movies={movies} />
      )}
    </div>
  );
}
