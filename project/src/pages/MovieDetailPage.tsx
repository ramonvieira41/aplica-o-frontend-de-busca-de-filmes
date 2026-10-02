import { useEffect, useState } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { Heart, Clock, Calendar, User, Users, AlertCircle, Film } from 'lucide-react';
import { movieService } from '@/services/movieService';
import { useFavorites } from '@/hooks/useFavorites';
import { Button } from '@/components/Button';
import { RatingBadge } from '@/components/RatingBadge';
import { MovieRow } from '@/components/MovieRow';
import { formatDuration, formatDate, } from '@/utils/format';
import type { Movie } from '@/types';

export function MovieDetailPage() {
  const { id } = useParams({ from: '/movie/$id' });
  const { isFavorite, toggleFavorite } = useFavorites();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setError(false);
      try {
        const result = await movieService.getById(id);
        if (!active) return;
        if (result) {
          setMovie(result);
          const recs = await movieService.getRecommendations(id);
          if (active) setRecommendations(recs.slice(0, 12));
        } else {
          setMovie(null);
        }
        setLoading(false);
      } catch {
        if (active) {
          setError(true);
          setLoading(false);
        }
      }
    })();
    return () => { active = false; };
  }, [id]);

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
          Erro ao carregar o filme
        </h2>
        <p className="mt-2 text-sm text-base-500 dark:text-base-400">
          Não foi possível carregar os detalhes deste filme.
        </p>
        <Link to="/" className="mt-6">
          <Button>Voltar para a Home</Button>
        </Link>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="mx-auto max-w-screen-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <Film size={40} className="mb-4 text-base-400" />
          <h1 className="text-2xl font-bold font-display text-base-900 dark:text-base-100">
            Filme não encontrado
          </h1>
          <p className="mt-2 text-base-500 dark:text-base-400">
            O filme que você procura não está disponível em nosso catálogo.
          </p>
          <Link to="/" className="mt-6">
            <Button>Voltar para a Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const fav = isFavorite(movie.id);

  return (
    <div className="animate-fade-in">
      {/* Backdrop */}
      <div className="relative h-[clamp(240px,32vw,420px)] w-full overflow-hidden">
        {movie.backdropUrl && (
          <img
            src={movie.backdropUrl}
            alt={`Cena do filme ${movie.title}`}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-base-50 via-base-50/40 to-transparent dark:from-base-950 dark:via-base-950/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-base-50/60 via-transparent to-transparent dark:from-base-950/70" />
      </div>
      

      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 mt-6 sm:mt-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
          {/* Poster */}
          <div className="mx-auto w-40 flex-shrink-0 sm:mx-0 sm:w-52 lg:w-60">
            <div className="overflow-hidden rounded-xl bg-base-900 shadow-2xl">
              {movie.posterUrl ? (
                <img
                  src={movie.posterUrl}
                  alt={`Pôster do filme ${movie.title}`}
                  className="block h-auto w-full object-contain"
                />
              ) : (
                <div className="flex aspect-[2/3] items-center justify-center bg-base-200 dark:bg-base-800">
                  <Film size={40} className="text-base-400" />
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold font-display tracking-tight text-base-900 drop-shadow-sm dark:text-base-50 sm:text-4xl">
              {movie.title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <RatingBadge rating={movie.rating} size="md" />
              {movie.releaseDate && (
                <span className="inline-flex items-center gap-1.5 text-sm text-base-600 dark:text-base-300">
                  <Calendar size={15} /> {formatDate(movie.releaseDate)}
                </span>
              )}
              {movie.durationMinutes > 0 && (
                <span className="inline-flex items-center gap-1.5 text-sm text-base-600 dark:text-base-300">
                  <Clock size={15} /> {formatDuration(movie.durationMinutes)}
                </span>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {movie.genreIds.map((gId, idx) => {
                const name = movie.genreNames[idx];
                return (
                  <Link
                    key={gId}
                    to="/genres/$genre"
                    params={{ genre: gId }}
                    className="rounded-full bg-base-200 px-3 py-1 text-xs font-medium text-base-700 transition-colors hover:bg-primary-500 hover:text-white dark:bg-base-800 dark:text-base-300 dark:hover:bg-primary-500 dark:hover:text-white focus-ring"
                  >
                    {name}
                  </Link>
                );
              })}
            </div>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-base-700 dark:text-base-200">
              {movie.synopsis}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                variant={fav ? 'danger' : 'primary'}
                size="lg"
                onClick={() => toggleFavorite(movie.id)}
              >
                <Heart size={18} className={fav ? 'fill-current' : ''} />
                {fav ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
              </Button>
            </div>

            <dl className="mt-8 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {movie.director && (
                <div className="flex items-start gap-2.5">
                  <User size={18} className="mt-0.5 flex-shrink-0 text-base-400" />
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-base-400">Direção</dt>
                    <dd className="text-sm text-base-800 dark:text-base-200">{movie.director}</dd>
                  </div>
                </div>
              )}
              {movie.cast.length > 0 && (
                <div className="flex items-start gap-2">
                  <Users size={18} className="mt-0.5 flex-shrink-0 text-base-400" />
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-base-400">Elenco</dt>
                    <dd className="text-sm text-base-800 dark:text-base-200">{movie.cast.join(', ')}</dd>
                  </div>
                </div>
              )}
            </dl>
          </div>
        </div>

        {recommendations.length > 0 && (
          <div className="mt-16">
            <MovieRow title="Recomendações" movies={recommendations} />
          </div>
        )}

        <div className="h-16" />
      </div>
    </div>
  );
}
