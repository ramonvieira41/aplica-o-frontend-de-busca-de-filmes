export type GenreId = string;

export interface Movie {
  id: string;
  title: string;
  synopsis: string;
  posterUrl: string;
  backdropUrl: string;
  genreIds: GenreId[];
  genreNames: string[];
  releaseDate: string;
  durationMinutes: number;
  rating: number;
  director: string;
  cast: string[];
}

export interface GenreInfo {
  id: GenreId;
  label: string;
  description: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthSession {
  user: User;
  token: string;
}

export type ThemeMode = 'light' | 'dark';
