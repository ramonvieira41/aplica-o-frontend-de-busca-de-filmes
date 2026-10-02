import { MovieCard } from '@/components/MovieCard';
import type { Movie } from '@/types';

export function MovieGrid({ movies }: { movies: Movie[] }) {
  if (movies.length === 0) return null;
  return (
    <div className="grid grid-cols-2 gap-4 px-4 sm:grid-cols-3 sm:px-6 md:grid-cols-4 lg:grid-cols-5 lg:px-8 xl:grid-cols-6">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
