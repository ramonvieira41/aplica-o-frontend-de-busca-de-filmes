import { Link } from '@tanstack/react-router';
import { Clapperboard } from 'lucide-react';
import { Button } from '@/components/Button';

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center animate-fade-in">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-base-100 text-base-400 dark:bg-base-800 dark:text-base-500">
        <Clapperboard size={40} />
      </div>
      <h1 className="text-5xl font-bold font-display text-base-900 dark:text-base-100">
        404
      </h1>
      <p className="mt-3 text-lg text-base-600 dark:text-base-300">
        Página não encontrada
      </p>
      <p className="mt-1 max-w-md text-sm text-base-500 dark:text-base-400">
        A página que você procura pode ter sido removida ou não existe.
      </p>
      <Link to="/" className="mt-8">
        <Button size="lg">Voltar para a Home</Button>
      </Link>
    </div>
  );
}
