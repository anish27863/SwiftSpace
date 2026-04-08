import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  hover?: boolean;
}

export function Card({ className, glass, hover, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-[var(--radius-xl)] bg-white border border-[oklch(0.93_0.003_265)]',
        'shadow-[var(--shadow-card)]',
        glass && 'glass',
        hover && 'card-hover cursor-pointer',
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('p-5 pb-3', className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('px-5 pb-4', className)} {...props} />
  );
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'px-5 pb-5 pt-3 flex items-center gap-3 border-t border-[oklch(0.93_0.003_265)]',
        className
      )}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('text-base font-semibold text-[oklch(0.16_0.01_265)] leading-snug', className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('text-sm text-[oklch(0.50_0.01_265)] mt-0.5', className)}
      {...props}
    />
  );
}
