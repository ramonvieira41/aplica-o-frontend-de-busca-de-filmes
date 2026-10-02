import { useEffect, useState } from 'react';
import { Hero } from '@/components/Hero';
import { MovieRow } from '@/components/MovieRow';
import { Link } from '@tanstack/react-router';
import { AlertCircle } from 'lucide-react';
import { movieService } from '@/services/movieService';
import { GENRES } from '@/data/genres';
import { Button } from '@/components/Button';
import type { Movie } from '@/types';

export function HomePage() {
  const [featured, setFeatured] = useState<Movie | null>(null);
  const [popular, setPopular] = useState<Movie[]>([]);
  const [nowPlaying, setNowPlaying] = useState<Movie[]>([]);
  const [topRated, setTopRated] = useState<Movie[]>([]);
  const [byGenre, setByGenre] = useState<{ label: string; genreId: string; movies: Movie[] }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [trend, pop, playing, top] = await Promise.all([
          movieService.getTrending(),
          movieService.getPopular(),
          movieService.getNowPlaying(),
          movieService.getTopRated(),
        ]);
        if (!active) return;

        setFeatured(trend[0] ?? pop[0] ?? null);
        setPopular(pop);
        setNowPlaying(playing);
        setTopRated(top);

        const genreRows = await Promise.all(
          GENRES.slice(0, 4).map(async (g) => ({
            label: g.label,
            genreId: g.id,
            movies: (await movieService.getByGenre(g.id)).slice(0, 12),
          })),
        );
        if (!active) return;
        setByGenre(genreRows);
        setLoading(false);
      } catch {
        if (active) {
          setError(true);
          setLoading(false);
        }
      }
    })();
    return () => { active = false; };
  }, []);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-base-200 border-t-primary-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center animate-fade-in">
        <AlertCircle size={40} className="mb-4 text-base-400" />
        <h2 className="text-xl font-bold font-display text-base-900 dark:text-base-100">
          Não foi possível carregar os filmes
        </h2>
        <p className="mt-2 text-sm text-base-500 dark:text-base-400">
          Verifique sua conexão e tente novamente.
        </p>
        <Link to="/" className="mt-6">
          <Button>Tentar novamente</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {featured && <Hero movie={featured} />}

      <div className="space-y-2 py-8">
        <MovieRow title="Populares Agora" movies={popular} />
        <MovieRow title="Nos Cinemas" movies={nowPlaying} />
        <MovieRow title="Mais Avaliados" movies={topRated} />

        {byGenre.map((row) => (
          <MovieRow key={row.genreId} title={row.label} movies={row.movies} />
        ))}
      </div>
    </div>
  );
}
