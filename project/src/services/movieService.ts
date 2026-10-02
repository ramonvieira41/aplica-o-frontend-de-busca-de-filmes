import type { Movie, GenreId } from '@/types';
import { posterUrl, backdropUrl } from '@/utils/tmdbImages';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

function proxyUrl(route: string, params: Record<string, string> = {}): string {
  const qs = new URLSearchParams(params).toString();
  const base = `${SUPABASE_URL}/functions/v1/tmdb-proxy/${route}`;
  return qs ? `${base}?${qs}` : base;
}

async function proxyFetch<T>(route: string, params: Record<string, string> = {}): Promise<T> {
  const url = proxyUrl(route, params);
  const resp = await fetch(url, {
    headers: {
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
  });
  if (!resp.ok) {
    throw new Error(`Request failed (${resp.status})`);
  }
  return resp.json() as Promise<T>;
}

/* ---------- Raw TMDB response types ---------- */

interface TmdbMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  release_date: string;
  runtime?: number | null;
  vote_average: number;
}

interface TmdbCredit {
  id: number;
  name: string;
  character?: string;
  job?: string;
  order?: number;
}

interface TmdbCreditsResponse {
  cast: TmdbCredit[];
  crew: TmdbCredit[];
}

interface TmdbMovieListResponse {
  page: number;
  results: TmdbMovie[];
  total_pages: number;
  total_results: number;
}

interface TmdbMovieDetailResponse extends TmdbMovie {
  runtime: number | null;
  genres: { id: number; name: string }[];
  credits?: TmdbCreditsResponse;
}

/* ---------- Mappers ---------- */

function mapMovie(raw: TmdbMovie): Movie {
  const genreIds: GenreId[] = (raw.genre_ids ?? raw.genres?.map((g) => g.id) ?? []).map(String);
  const genreNames: string[] = raw.genres?.map((g) => g.name) ?? [];

  return {
    id: String(raw.id),
    title: raw.title || 'Sem título',
    synopsis: raw.overview || 'Sinopse não disponível.',
    posterUrl: posterUrl(raw.poster_path),
    backdropUrl: backdropUrl(raw.backdrop_path),
    genreIds,
    genreNames,
    releaseDate: raw.release_date || '',
    durationMinutes: raw.runtime ?? 0,
    rating: raw.vote_average ?? 0,
    director: '',
    cast: [],
  };
}

function mapMovieDetail(raw: TmdbMovieDetailResponse): Movie {
  const base = mapMovie(raw);
  const director = raw.credits?.crew.find((c) => c.job === 'Director')?.name ?? '';
  const cast = (raw.credits?.cast ?? [])
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
    .slice(0, 10)
    .map((c) => c.name);

  return {
    ...base,
    genreIds: raw.genres.map((g) => String(g.id)),
    genreNames: raw.genres.map((g) => g.name),
    durationMinutes: raw.runtime ?? 0,
    director,
    cast,
  };
}

/* ---------- Public API ---------- */

export const movieService = {
  async getPopular(page = 1): Promise<Movie[]> {
    const data = await proxyFetch<TmdbMovieListResponse>('popular', { page: String(page) });
    return data.results.filter((m) => m.poster_path).map(mapMovie);
  },

  async getNowPlaying(page = 1): Promise<Movie[]> {
    const data = await proxyFetch<TmdbMovieListResponse>('now-playing', { page: String(page) });
    return data.results.filter((m) => m.poster_path).map(mapMovie);
  },

  async getTopRated(page = 1): Promise<Movie[]> {
    const data = await proxyFetch<TmdbMovieListResponse>('top-rated', { page: String(page) });
    return data.results.filter((m) => m.poster_path).map(mapMovie);
  },

  async getTrending(): Promise<Movie[]> {
    const data = await proxyFetch<TmdbMovieListResponse>('trending', { window: 'week' });
    return data.results.filter((m) => m.poster_path).map(mapMovie);
  },

  async getById(id: string): Promise<Movie | null> {
    try {
      const data = await proxyFetch<TmdbMovieDetailResponse>('movie-details', { id });
      return mapMovieDetail(data);
    } catch {
      return null;
    }
  },

  async getByGenre(genreId: GenreId, page = 1): Promise<Movie[]> {
    const data = await proxyFetch<TmdbMovieListResponse>('discover-genre', {
      genre_id: genreId,
      page: String(page),
    });
    return data.results.filter((m) => m.poster_path).map(mapMovie);
  },

  async search(query: string, page = 1): Promise<Movie[]> {
    const q = query.trim();
    if (!q) return [];
    const data = await proxyFetch<TmdbMovieListResponse>('search', { query: q, page: String(page) });
    return data.results.filter((m) => m.poster_path).map(mapMovie);
  },

  async getByIds(ids: string[]): Promise<Movie[]> {
    const results = await Promise.all(
      ids.map((id) => this.getById(id)),
    );
    const found = results.filter((m): m is Movie => m !== null);
    const ordered = ids
      .map((id) => found.find((m) => m.id === id))
      .filter((m): m is Movie => m !== null);
    return ordered;
  },

  async getRecommendations(id: string): Promise<Movie[]> {
    const data = await proxyFetch<TmdbMovieListResponse>('recommendations', { id });
    return data.results.filter((m) => m.poster_path).map(mapMovie);
  },
};

export const genreService = {
  getAll() {
    return GENRES_REF;
  },

  getById(id: string) {
    return GENRES_REF.find((g) => g.id === id) ?? null;
  },
};

import { GENRES } from '@/data/genres';
const GENRES_REF = GENRES;
