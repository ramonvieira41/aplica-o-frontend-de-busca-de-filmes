import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Sun, Moon, LogOut, User, Mail, Settings as SettingsIcon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/Button';

export function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const [serverError, setServerError] = useState('');

  const handleLogout = async () => {
    setServerError('');
    try {
      await logout();
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Erro ao sair da conta');
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-display text-base-900 dark:text-base-100 sm:text-3xl">
          Configurações
        </h1>
        <p className="mt-1 text-sm text-base-500 dark:text-base-400">
          Gerencie suas preferências e conta.
        </p>
      </div>

      {serverError && (
        <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-400" role="alert">
          {serverError}
        </div>
      )}

      {/* Theme */}
      <section className="mb-6 rounded-xl border border-base-200 bg-base-100 p-6 dark:border-base-800 dark:bg-base-900">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-500/10 text-primary-500">
            {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-base-900 dark:text-base-100">Aparência</h2>
            <p className="text-sm text-base-500 dark:text-base-400">
              Tema atual: <span className="font-medium">{theme === 'dark' ? 'Escuro' : 'Claro'}</span>
            </p>
          </div>
          <Button variant="secondary" onClick={toggleTheme}>
            {theme === 'dark' ? <><Sun size={16} /> Claro</> : <><Moon size={16} /> Escuro</>}
          </Button>
        </div>
      </section>

      {/* Account */}
      {isAuthenticated && user ? (
        <section className="mb-6 rounded-xl border border-base-200 bg-base-100 p-6 dark:border-base-800 dark:bg-base-900">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-500/10 text-primary-500">
              <User size={20} />
            </div>
            <h2 className="font-semibold text-base-900 dark:text-base-100">Conta</h2>
          </div>

          <dl className="space-y-3">
            <div className="flex items-center gap-3">
              <SettingsIcon size={16} className="text-base-400" />
              <dt className="text-sm text-base-500 dark:text-base-400">Nome</dt>
              <dd className="ml-auto text-sm font-medium text-base-900 dark:text-base-100">{user.user_metadata.name ?? user.email}</dd>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-base-400" />
              <dt className="text-sm text-base-500 dark:text-base-400">Email</dt>
              <dd className="ml-auto text-sm font-medium text-base-900 dark:text-base-100">{user.email}</dd>
            </div>
          </dl>

          <div className="mt-6 border-t border-base-200 pt-4 dark:border-base-800">
            <Button variant="danger" onClick={handleLogout}>
              <LogOut size={16} /> Sair da conta
            </Button>
          </div>
        </section>
      ) : (
        <section className="mb-6 rounded-xl border border-base-200 bg-base-100 p-6 dark:border-base-800 dark:bg-base-900">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-500/10 text-primary-500">
              <User size={20} />
            </div>
            <h2 className="font-semibold text-base-900 dark:text-base-100">Conta</h2>
          </div>
          <p className="text-sm text-base-500 dark:text-base-400">
            Você não está autenticado. Faça login ou crie uma conta para gerenciar seu perfil.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link to="/login"><Button>Entrar</Button></Link>
            <Link to="/register"><Button variant="secondary">Criar conta</Button></Link>
          </div>
        </section>
      )}
    </div>
  );
}
