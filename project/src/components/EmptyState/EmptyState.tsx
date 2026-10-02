import type { ReactNode } from 'react';
import { Film } from 'lucide-react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center animate-fade-in">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-base-100 text-base-400 dark:bg-base-800 dark:text-base-500">
        {icon ?? <Film size={28} />}
      </div>
      <h3 className="text-lg font-semibold text-base-900 dark:text-base-100">{title}</h3>
      {description && (
        <p className="mt-2 max-w-md text-sm text-base-500 dark:text-base-400">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
