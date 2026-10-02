import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Search as SearchIcon, SearchX, AlertCircle } from 'lucide-react';
import { movieService } from '@/services/movieService';
import { MovieGrid } from '@/components/MovieGrid';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/Button';
import type { Movie } from '@/types';

export function SearchPage() {
  const { q } = useSearch({ from: '/search' });
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await movieService.search(q);
        if (active) {
          setResults(res);
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
  }, [q]);

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-display text-base-900 dark:text-base-100 sm:text-3xl">
          Resultados da busca
        </h1>
        <p className="mt-1 text-sm text-base-500 dark:text-base-400">
          {loading ? 'Buscando...' : `${results.length} ${results.length === 1 ? 'resultado' : 'resultados'} para "${q}"`}
        </p>
      </div>

      {loading ? (
        <div className="flex h-[40vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-base-200 border-t-primary-500" />
        </div>
      ) : error ? (
        <div className="mx-auto flex max-w-md flex-col items-center py-20 text-center animate-fade-in">
          <AlertCircle size={40} className="mb-4 text-base-400" />
          <h2 className="text-xl font-bold font-display text-base-900 dark:text-base-100">
            Erro ao buscar
          </h2>
          <p className="mt-2 text-sm text-base-500 dark:text-base-400">
            Não foi possível concluir a busca. Tente novamente.
          </p>
          <Link to="/" className="mt-6">
            <Button>Voltar para a Home</Button>
          </Link>
        </div>
      ) : results.length === 0 ? (
        <EmptyState
          icon={<SearchX size={28} />}
          title="Nenhum resultado encontrado"
          description={`Não encontramos filmes para "${q}". Tente buscar por outro termo.`}
          action={
            <Link to="/">
              <Button><SearchIcon size={16} /> Voltar para a Home</Button>
            </Link>
          }
        />
      ) : (
        <MovieGrid movies={results} />
      )}
    </div>
  );
}

import { useSearch } from '@tanstack/react-router';
