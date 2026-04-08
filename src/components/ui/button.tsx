'use client';

import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-[oklch(0.58_0.25_285)] text-white hover:bg-[oklch(0.50_0.27_285)] shadow-[var(--shadow-brand)] active:bg-[oklch(0.44_0.24_285)]',
  secondary:
    'bg-[oklch(0.93_0.04_280)] text-[oklch(0.42_0.22_285)] hover:bg-[oklch(0.87_0.08_280)] active:bg-[oklch(0.80_0.10_280)]',
  outline:
    'border border-[oklch(0.80_0.10_285)] text-[oklch(0.50_0.27_285)] hover:bg-[oklch(0.97_0.01_280)] active:bg-[oklch(0.93_0.04_280)]',
  ghost:
    'text-[oklch(0.40_0.02_265)] hover:bg-[oklch(0.95_0.003_265)] active:bg-[oklch(0.90_0.005_265)]',
  destructive:
    'bg-[oklch(0.58_0.22_25)] text-white hover:bg-[oklch(0.50_0.20_25)] active:bg-[oklch(0.44_0.18_25)]',
};

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2.5',
  icon: 'h-9 w-9',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center rounded-[var(--radius-md)] font-medium',
          'transition-all duration-150 ease-out',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[oklch(0.58_0.25_285)]',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          'select-none',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
