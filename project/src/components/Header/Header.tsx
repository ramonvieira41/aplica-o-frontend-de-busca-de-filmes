import { useState } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { Clapperboard, Home, Heart, Tag, Info, Settings, Menu, X, } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites } from '@/hooks/useFavorites';
import { SearchBar } from '@/components/SearchBar';

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/favorites', label: 'Favoritos', icon: Heart },
  { to: '/genres', label: 'Gêneros', icon: Tag },
  { to: '/about', label: 'Sobre', icon: Info },
  { to: '/settings', label: 'Configurações', icon: Settings },
] as const;

export function Header() {
  const { isAuthenticated } = useAuth();
  const { count } = useFavorites();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (to: string) => {
    if (to === '/') return location.pathname === '/';
    return location.pathname.startsWith(to);
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-base-200 bg-base-50/80 backdrop-blur-md transition-colors dark:border-base-800 dark:bg-base-950/80">
        <div className="mx-auto flex h-16 max-w-screen-2xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menu"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-base-700 hover:bg-base-200 dark:text-base-300 dark:hover:bg-base-800 focus-ring lg:hidden"
          >
            <Menu size={22} />
          </button>

          <Link
            to="/"
            className="flex flex-shrink-0 items-center gap-2 rounded-lg focus-ring"
            aria-label="Cinephile — página inicial"
          >
            <Clapperboard size={26} className="text-primary-500" />
            <span className="hidden text-lg font-bold font-display tracking-tight text-base-900 dark:text-base-100 sm:block">
              Cinephile
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegação principal">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-ring ${
                  isActive(to)
                    ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
                    : 'text-base-600 hover:bg-base-200 hover:text-base-900 dark:text-base-400 dark:hover:bg-base-800 dark:hover:text-base-100'
                }`}
              >
                {to === '/favorites' && count > 0 ? (
                  <span className="relative">
                    <Icon size={18} />
                    <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-500 px-1 text-[10px] font-bold text-white">
                      {count}
                    </span>
                  </span>
                ) : (
                  <Icon size={18} />
                )}
                {label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto hidden flex-1 justify-end sm:flex lg:max-w-xs">
            <SearchBar variant="desktop" />
          </div>

          <div className="ml-auto sm:hidden">
            <SearchBar variant="mobile" />
          </div>

          <div className="hidden flex-shrink-0 sm:block">
            {isAuthenticated ? (
              <Link
                to="/settings"
                className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-600 focus-ring"
              >
                Minha Conta
              </Link>
            ) : (
              <Link
                to="/login"
                className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-600 focus-ring"
              >
                Entrar
              </Link>
            )}
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 animate-fade-in"
            onClick={() => setMenuOpen(false)}
            aria-hidden
          />
          <div className="absolute left-0 top-0 h-full w-72 max-w-[85vw] overflow-y-auto bg-base-50 shadow-2xl animate-slide-in-left dark:bg-base-900">
            <div className="flex h-16 items-center justify-between border-b border-base-200 px-4 dark:border-base-800">
              <div className="flex items-center gap-2">
                <Clapperboard size={24} className="text-primary-500" />
                <span className="text-lg font-bold font-display text-base-900 dark:text-base-100">
                  Cinephile
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Fechar menu"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-base-600 hover:bg-base-200 dark:text-base-400 dark:hover:bg-base-800 focus-ring"
              >
                <X size={22} />
              </button>
            </div>
            <nav className="flex flex-col gap-1 p-3" aria-label="Navegação mobile">
              {navItems.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors focus-ring ${
                    isActive(to)
                      ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
                      : 'text-base-700 hover:bg-base-200 dark:text-base-300 dark:hover:bg-base-800'
                  }`}
                >
                  <Icon size={20} />
                  {label}
                  {to === '/favorites' && count > 0 && (
                    <span className="ml-auto rounded-full bg-accent-500 px-2 py-0.5 text-xs font-bold text-white">
                      {count}
                    </span>
                  )}
                </Link>
              ))}
              <div className="my-2 h-px bg-base-200 dark:bg-base-800" />
              {isAuthenticated ? (
                <Link
                  to="/settings"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-base-700 hover:bg-base-200 dark:text-base-300 dark:hover:bg-base-800 focus-ring"
                >
                  <Settings size={20} />
                  Minha Conta
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-base-700 hover:bg-base-200 dark:text-base-300 dark:hover:bg-base-800 focus-ring"
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                    className="mt-1 rounded-lg bg-primary-500 px-3 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-primary-600 focus-ring"
                  >
                    Criar Conta
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
