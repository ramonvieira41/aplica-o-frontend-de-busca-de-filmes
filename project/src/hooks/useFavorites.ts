import { useSyncExternalStore } from 'react';
import { loadJSON, saveJSON } from '@/utils/storage';

const STORAGE_KEY = 'cinephile-favorites';

type Listener = () => void;
const listeners = new Set<Listener>();

let currentFavorites: string[] = loadJSON<string[]>(STORAGE_KEY, []);

function emit(): void {
  for (const l of listeners) l();
}

export function addFavorite(movieId: string): void {
  if (currentFavorites.includes(movieId)) return;
  currentFavorites = [...currentFavorites, movieId];
  saveJSON(STORAGE_KEY, currentFavorites);
  emit();
}

export function removeFavorite(movieId: string): void {
  if (!currentFavorites.includes(movieId)) return;
  currentFavorites = currentFavorites.filter((id) => id !== movieId);
  saveJSON(STORAGE_KEY, currentFavorites);
  emit();
}

export function toggleFavorite(movieId: string): void {
  if (currentFavorites.includes(movieId)) {
    removeFavorite(movieId);
  } else {
    addFavorite(movieId);
  }
}

export function isFavorite(movieId: string): boolean {
  return currentFavorites.includes(movieId);
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): string[] {
  return currentFavorites;
}

export function useFavorites(): {
  favorites: string[];
  addFavorite: typeof addFavorite;
  removeFavorite: typeof removeFavorite;
  toggleFavorite: typeof toggleFavorite;
  isFavorite: typeof isFavorite;
  count: number;
} {
  const favorites = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    count: favorites.length,
  };
}
