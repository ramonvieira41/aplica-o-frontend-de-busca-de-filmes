import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Clapperboard, AlertCircle } from 'lucide-react';
import { loginSchema, type LoginFormData } from '@/schemas/auth';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError('');
    try {
      await login(data.email, data.password);
      await navigate({ to: '/' });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Erro ao fazer login');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-fade-up">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-500 text-white">
            <Clapperboard size={28} />
          </div>
          <h1 className="text-2xl font-bold font-display text-base-900 dark:text-base-100">
            Bem-vindo de volta
          </h1>
          <p className="mt-1 text-sm text-base-500 dark:text-base-400">
            Entre para acessar seus favoritos e preferências.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 rounded-2xl border border-base-200 bg-base-100 p-6 dark:border-base-800 dark:bg-base-900"
          noValidate
        >
          {serverError && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-400" role="alert">
              <AlertCircle size={16} className="flex-shrink-0" />
              {serverError}
            </div>
          )}

          <Input
            label="Email"
            type="email"
            placeholder="seu@email.com"
            icon={<Mail size={18} />}
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Senha"
            type="password"
            placeholder="••••••••"
            icon={<Lock size={18} />}
            error={errors.password?.message}
            {...register('password')}
          />

          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-base-500 dark:text-base-400">
          Não tem uma conta?{' '}
          <Link
            to="/register"
            className="font-medium text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 focus-ring rounded"
          >
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
