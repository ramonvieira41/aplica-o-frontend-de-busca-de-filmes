import { useSyncExternalStore } from 'react';
import type { ThemeMode } from '@/types';

const STORAGE_KEY = 'cinephile-theme';

type Listener = () => void;

const listeners = new Set<Listener>();

let currentTheme: ThemeMode = (() => {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (stored === 'light' || stored === 'dark') {
    return stored;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
})();

function applyTheme(theme: ThemeMode): void {
  const root = document.documentElement;

  root.classList.add('theme-transitioning');

  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  root.style.colorScheme = theme;

  window.setTimeout(() => {
    root.classList.remove('theme-transitioning');
  }, 250);
}

applyTheme(currentTheme);

function emit(): void {
  for (const listener of listeners) {
    listener();
  }
}

export function setTheme(theme: ThemeMode): void {
  if (theme === currentTheme) return;

  currentTheme = theme;

  localStorage.setItem(STORAGE_KEY, theme);

  applyTheme(theme);

  emit();
}

export function toggleTheme(): void {
  setTheme(currentTheme === 'dark' ? 'light' : 'dark');
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);

  return () => listeners.delete(listener);
}

function getSnapshot(): ThemeMode {
  return currentTheme;
}

export function useTheme(): {
  theme: ThemeMode;
  setTheme: typeof setTheme;
  toggleTheme: typeof toggleTheme;
} {
  const theme = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getSnapshot
  );

  return {
    theme,
    setTheme,
    toggleTheme,
  };
}