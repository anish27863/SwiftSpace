import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[oklch(0.28_0.015_265)]"
          >
            {label}
            {props.required && (
              <span className="text-[oklch(0.58_0.22_25)] ml-0.5">*</span>
            )}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-[oklch(0.60_0.01_265)] pointer-events-none">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full rounded-[var(--radius-md)] border bg-white px-3.5 py-2.5 text-sm',
              'text-[oklch(0.16_0.01_265)] placeholder:text-[oklch(0.68_0.005_265)]',
              'transition-all duration-150',
              'focus:outline-none focus:ring-2 focus:ring-[oklch(0.58_0.25_285)] focus:ring-offset-0',
              error
                ? 'border-[oklch(0.70_0.15_25)] focus:ring-[oklch(0.58_0.22_25)]'
                : 'border-[oklch(0.85_0.005_265)] hover:border-[oklch(0.75_0.08_285)] focus:border-[oklch(0.58_0.25_285)]',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 text-[oklch(0.60_0.01_265)]">
              {rightIcon}
            </span>
          )}
        </div>
        {error && (
          <p className="text-xs text-[oklch(0.50_0.18_25)] flex items-center gap-1">
            <span>⚠</span> {error}
          </p>
        )}
        {hint && !error && (
          <p className="text-xs text-[oklch(0.58_0.005_265)]">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Textarea variant
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-[oklch(0.28_0.015_265)]"
          >
            {label}
            {props.required && (
              <span className="text-[oklch(0.58_0.22_25)] ml-0.5">*</span>
            )}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={3}
          className={cn(
            'w-full rounded-[var(--radius-md)] border bg-white px-3.5 py-2.5 text-sm',
            'text-[oklch(0.16_0.01_265)] placeholder:text-[oklch(0.68_0.005_265)]',
            'transition-all duration-150 resize-none',
            'focus:outline-none focus:ring-2 focus:ring-[oklch(0.58_0.25_285)] focus:ring-offset-0',
            error
              ? 'border-[oklch(0.70_0.15_25)]'
              : 'border-[oklch(0.85_0.005_265)] hover:border-[oklch(0.75_0.08_285)] focus:border-[oklch(0.58_0.25_285)]',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-[oklch(0.50_0.18_25)]">⚠ {error}</p>
        )}
        {hint && !error && (
          <p className="text-xs text-[oklch(0.58_0.005_265)]">{hint}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
