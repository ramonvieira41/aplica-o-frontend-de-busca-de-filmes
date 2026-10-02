import { useState, useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Search, X, Loader2 } from 'lucide-react';
import { movieService } from '@/services/movieService';
import type { Movie } from '@/types';

interface SearchBarProps {
  variant?: 'desktop' | 'mobile';
  onSearch?: () => void;
}

export function SearchBar({ variant = 'desktop', onSearch }: SearchBarProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(variant === 'desktop');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (variant === 'mobile' && expanded) {
      inputRef.current?.focus();
    }
  }, [expanded, variant]);

  useEffect(() => {
    const handler = setTimeout(async () => {
      const q = query.trim();
      if (q.length < 2) {
        setResults([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await movieService.search(q);
        setResults(res.slice(0, 6));
      } catch {
        setResults([]);
      }
      setLoading(false);
    }, 350);
    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        if (variant === 'mobile') setExpanded(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [variant]);

  const goToResults = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setOpen(false);
    setExpanded(variant === 'desktop');
    onSearch?.();
    navigate({ to: '/search', search: { q: trimmed } });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    goToResults(query);
  };

  if (variant === 'mobile') {
    return (
      <div ref={containerRef} className="relative flex items-center">
        {expanded ? (
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-1 animate-scale-in"
          >
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                placeholder="Buscar filmes..."
                aria-label="Buscar filmes"
                className="w-44 rounded-lg border border-base-200 bg-base-50 px-3 py-2 text-sm text-base-900 placeholder:text-base-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:border-base-700 dark:bg-base-900 dark:text-base-100"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setExpanded(false);
                setQuery('');
                setResults([]);
                setOpen(false);
              }}
              aria-label="Fechar busca"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-base-500 hover:text-base-700 dark:hover:text-base-300 focus-ring"
            >
              <X size={20} />
            </button>
            {open && (
              <SearchDropdown
                query={query}
                results={results}
                loading={loading}
                onSelect={(m) => {
                  setOpen(false);
                  setExpanded(false);
                  setQuery('');
                  onSearch?.();
                  navigate({ to: '/movie/$id', params: { id: m.id } });
                }}
                onSeeAll={() => goToResults(query)}
              />
            )}
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            aria-label="Abrir busca"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-base-600 hover:text-base-900 dark:text-base-300 dark:hover:text-base-100 focus-ring"
          >
            <Search size={22} />
          </button>
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-xs">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base-400">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="Buscar filmes..."
            aria-label="Buscar filmes"
            className="w-full rounded-lg border border-base-200 bg-base-50 py-2 pl-10 pr-9 text-sm text-base-900 placeholder:text-base-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:border-base-700 dark:bg-base-900 dark:text-base-100 dark:placeholder:text-base-500"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setResults([]);
              }}
              aria-label="Limpar busca"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-base-400 hover:text-base-600 dark:hover:text-base-300 focus-ring"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </form>
      {open && (
        <SearchDropdown
          query={query}
          results={results}
          loading={loading}
          onSelect={(m) => {
            setOpen(false);
            setQuery('');
            navigate({ to: '/movie/$id', params: { id: m.id } });
          }}
          onSeeAll={() => goToResults(query)}
        />
      )}
    </div>
  );
}

interface SearchDropdownProps {
  query: string;
  results: Movie[];
  loading: boolean;
  onSelect: (movie: Movie) => void;
  onSeeAll: () => void;
}

function SearchDropdown({ query, results, loading, onSelect, onSeeAll }: SearchDropdownProps) {
  const q = query.trim();

  if (q.length < 2) return null;

  return (
    <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-base-200 bg-white shadow-xl animate-fade-in dark:border-base-700 dark:bg-base-900">
      {loading && (
        <div className="flex items-center justify-center gap-2 px-4 py-6 text-sm text-base-500 dark:text-base-400">
          <Loader2 size={16} className="animate-spin" /> Buscando...
        </div>
      )}

      {!loading && results.length === 0 && (
        <div className="px-4 py-6 text-center text-sm text-base-500 dark:text-base-400">
          Nenhum resultado para &ldquo;{q}&rdquo;
        </div>
      )}

      {!loading && results.length > 0 && (
        <ul className="max-h-80 overflow-y-auto py-1">
          {results.map((movie) => (
            <li key={movie.id}>
              <button
                type="button"
                onClick={() => onSelect(movie)}
                className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-base-100 dark:hover:bg-base-800 focus-ring"
              >
                {movie.posterUrl ? (
                  <img
                    src={movie.posterUrl}
                    alt=""
                    className="h-12 w-9 flex-shrink-0 rounded object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-12 w-9 flex-shrink-0 rounded bg-base-200 dark:bg-base-800" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-base-900 dark:text-base-100">
                    {movie.title}
                  </p>
                  {movie.genreNames.length > 0 && (
                    <p className="truncate text-xs text-base-500 dark:text-base-400">
                      {movie.genreNames.join(', ')}
                    </p>
                  )}
                </div>
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={onSeeAll}
              className="flex w-full items-center justify-center px-3 py-2.5 text-sm font-medium text-primary-600 transition-colors hover:bg-base-100 dark:text-primary-400 dark:hover:bg-base-800 focus-ring"
            >
              Ver todos os resultados
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
