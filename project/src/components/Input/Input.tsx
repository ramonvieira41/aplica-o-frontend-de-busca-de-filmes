import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, id, className = '', ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-base-700 dark:text-base-300"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {icon && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base-400">
              {icon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={`w-full rounded-lg border bg-base-50 px-3.5 py-2.5 text-sm text-base-900 placeholder:text-base-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-base-900 dark:text-base-100 dark:placeholder:text-base-500 ${
              error
                ? 'border-red-500 focus:ring-red-500'
                : 'border-base-200 dark:border-base-700'
            } ${icon ? 'pl-10' : ''} ${className}`}
            {...props}
          />
        </div>

        {error && (
          <p
            className="mt-1.5 text-sm text-red-600 dark:text-red-400"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
