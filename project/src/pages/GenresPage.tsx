import { GENRES } from '@/data/genres';
import { GenreCard } from '@/components/GenreCard';

export function GenresPage() {
  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-display text-base-900 dark:text-base-100 sm:text-3xl">
          Gêneros
        </h1>
        <p className="mt-1 text-sm text-base-500 dark:text-base-400">
          Explore o catálogo por categoria e descubra novos títulos.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {GENRES.map((genre) => (
          <GenreCard key={genre.id} genre={genre} />
        ))}
      </div>
    </div>
  );
}
