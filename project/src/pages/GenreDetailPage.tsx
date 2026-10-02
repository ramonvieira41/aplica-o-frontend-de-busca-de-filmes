import { useEffect, useState } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { ChevronLeft, AlertCircle } from 'lucide-react';
import { movieService, genreService } from '@/services/movieService';
import { MovieGrid } from '@/components/MovieGrid';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/Button';
import type { GenreId, Movie } from '@/types';

export function GenreDetailPage() {
  const { genre: genreId } = useParams({ from: '/genres/$genre' });
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const genreInfo = genreService.getById(genreId);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setError(false);
      try {
        const result = await movieService.getByGenre(genreId as GenreId);
        if (active) {
          setMovies(result);
          setLoading(false);
        }
      } catch {
        if (active) {
          setError(true);
          setLoading(false);
        }
      }
    })();
    return () => { active = false; };
  }, [genreId]);

  if (!genreInfo) {
    return (
      <div className="mx-auto max-w-screen-2xl px-4 py-16 sm:px-6 lg:px-8">
        <EmptyState
          title="Gênero não encontrado"
          description="O gênero que você procura não existe em nosso catálogo."
          action={
            <Link to="/genres">
              <Button>Ver todos os gêneros</Button>
            </Link>
          }
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-[40vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-base-200 border-t-primary-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center animate-fade-in">
        <AlertCircle size={40} className="mb-4 text-base-400" />
        <h2 className="text-xl font-bold font-display text-base-900 dark:text-base-100">
          Erro ao carregar filmes
        </h2>
        <p className="mt-2 text-sm text-base-500 dark:text-base-400">
          Não foi possível carregar os filmes deste gênero.
        </p>
        <Link to="/genres" className="mt-6">
          <Button>Voltar para Gêneros</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      <Link
        to="/genres"
        className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-base-500 transition-colors hover:text-primary-600 dark:text-base-400 dark:hover:text-primary-400 focus-ring rounded"
      >
        <ChevronLeft size={16} /> Voltar para Gêneros
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold font-display text-base-900 dark:text-base-100 sm:text-3xl">
          {genreInfo.label}
        </h1>
        <p className="mt-1 text-sm text-base-500 dark:text-base-400">
          {genreInfo.description}
        </p>
      </div>

      {movies.length === 0 ? (
        <EmptyState
          title="Nenhum filme neste gênero"
          description="Ainda não temos filmes cadastrados nesta categoria."
        />
      ) : (
        <MovieGrid movies={movies} />
      )}
    </div>
  );
}
