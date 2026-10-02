import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Lock, Clapperboard, AlertCircle } from 'lucide-react';
import { registerSchema, type RegisterFormData } from '@/schemas/auth';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setServerError('');
    setSuccessMessage('');
    try {
      const user = await registerUser(data.name, data.email, data.password);
      if (user) {
        await navigate({ to: '/' });
      } else {
        setSuccessMessage('Confira seu email para confirmar o cadastro.');
      }
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Erro ao cadastrar');
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
            Criar sua conta
          </h1>
          <p className="mt-1 text-sm text-base-500 dark:text-base-400">
            Cadastre-se para salvar seus filmes favoritos.
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

          {successMessage && (
            <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-950/40 dark:text-green-400" role="status">
              {successMessage}
            </p>
          )}

          <Input
            label="Nome"
            type="text"
            placeholder="Seu nome"
            icon={<User size={18} />}
            error={errors.name?.message}
            {...register('name')}
          />

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
            placeholder="Mínimo 6 caracteres"
            icon={<Lock size={18} />}
            error={errors.password?.message}
            {...register('password')}
          />

          <Input
            label="Confirmar senha"
            type="password"
            placeholder="Repita sua senha"
            icon={<Lock size={18} />}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Cadastrando...' : 'Criar conta'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-base-500 dark:text-base-400">
          Já tem uma conta?{' '}
          <Link
            to="/login"
            className="font-medium text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 focus-ring rounded"
          >
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}
