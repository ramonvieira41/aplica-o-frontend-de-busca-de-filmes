import { Link } from '@tanstack/react-router';
import { Clapperboard, Mail, HelpCircle } from 'lucide-react';
import { SiGithub, SiInstagram, SiX } from '@icons-pack/react-simple-icons';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-base-200 bg-base-100 transition-colors dark:border-base-800 dark:bg-base-950">
      <div className="mx-auto max-w-screen-2xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2">
              <Clapperboard size={24} className="text-primary-500" />
              <span className="text-lg font-bold font-display text-base-900 dark:text-base-100">
                Cinephile
              </span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-base-500 dark:text-base-400">
              Sua plataforma de streaming para descobrir, explorar e favoritar filmes
              de todos os gêneros.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-base-900 dark:text-base-100">
              Navegação
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-base-500 transition-colors hover:text-primary-600 dark:text-base-400 dark:hover:text-primary-400 focus-ring rounded">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="text-sm text-base-500 transition-colors hover:text-primary-600 dark:text-base-400 dark:hover:text-primary-400 focus-ring rounded">
                  Favoritos
                </Link>
              </li>
              <li>
                <Link to="/genres" className="text-sm text-base-500 transition-colors hover:text-primary-600 dark:text-base-400 dark:hover:text-primary-400 focus-ring rounded">
                  Gêneros
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-base-900 dark:text-base-100">
              Suporte
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-base-500 transition-colors hover:text-primary-600 dark:text-base-400 dark:hover:text-primary-400 focus-ring rounded">
                  Sobre a plataforma
                </Link>
              </li>
              <li>
                <a
                  href="mailto:suporte@cinephile.app"
                  className="inline-flex items-center gap-1.5 text-sm text-base-500 transition-colors hover:text-primary-600 dark:text-base-400 dark:hover:text-primary-400 focus-ring rounded"
                >
                  <Mail size={14} /> suporte@cinephile.app
                </a>
              </li>
              <li>
                <Link to="/settings" className="inline-flex items-center gap-1.5 text-sm text-base-500 transition-colors hover:text-primary-600 dark:text-base-400 dark:hover:text-primary-400 focus-ring rounded">
                  <HelpCircle size={14} /> Configurações
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-base-900 dark:text-base-100">
              Redes Sociais
            </h3>
            <div className="flex gap-3">
              {[
                { Icon: SiX, label: 'X', href: 'https://x.com' },
                { Icon: SiInstagram, label: 'Instagram', href: 'https://instagram.com' },
                { Icon: SiGithub, label: 'GitHub', href: 'https://github.com' },
              ].map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-base-200 text-base-600 transition-colors hover:bg-primary-500 hover:text-white dark:bg-base-800 dark:text-base-400 focus-ring"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-base-200 pt-6 dark:border-base-800">
          <p className="text-center text-sm text-base-400 dark:text-base-500">
            © {year} Cinephile. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
