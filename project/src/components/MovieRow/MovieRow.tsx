import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Movie } from '@/types';
import { MovieCard } from '@/components/MovieCard';

interface MovieRowProps {
  title: string;
  movies: Movie[];
}

export function MovieRow({ title, movies }: MovieRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollRef.current;
    if (!container) return;
    const amount = container.clientWidth * 0.8;
    container.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  if (movies.length === 0) return null;

  return (
    <section className="py-4" aria-labelledby={`row-${title}`}>
      <div className="mb-3 flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <h2 id={`row-${title}`} className="text-xl font-bold font-display text-base-900 dark:text-base-100">
          {title}
        </h2>
        <div className="hidden gap-1.5 sm:flex">
          <button
            type="button"
            onClick={() => scroll('left')}
            aria-label="Rolar para a esquerda"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-base-200 text-base-700 transition-colors hover:bg-base-300 dark:bg-base-800 dark:text-base-300 dark:hover:bg-base-700 focus-ring"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            aria-label="Rolar para a direita"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-base-200 text-base-700 transition-colors hover:bg-base-300 dark:bg-base-800 dark:text-base-300 dark:hover:bg-base-700 focus-ring"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="scrollbar-hide flex gap-3 overflow-x-auto scroll-smooth px-4 sm:px-6 lg:px-8 pb-2"
      >
        {movies.map((movie) => (
          <div key={movie.id} className="w-[140px] flex-shrink-0 sm:w-[170px] lg:w-[180px]">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </section>
  );
}
