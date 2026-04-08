import { cn } from '@/lib/utils';
import type { RoomCategory, BookingStatus } from '@/lib/types';
import { getCategoryLabel } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'active' | 'completed' | 'cancelled' | 'classroom' | 'lab' | 'studio';
  size?: 'sm' | 'md';
}

const variantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
  default:
    'bg-[oklch(0.93_0.04_285)] text-[oklch(0.42_0.22_285)] border-[oklch(0.80_0.10_285)]',
  active:
    'badge-active',
  completed:
    'badge-completed',
  cancelled:
    'badge-cancelled',
  classroom:
    'bg-[oklch(0.90_0.09_285)] text-[oklch(0.38_0.20_285)] border-[oklch(0.75_0.14_285)]',
  lab:
    'bg-[oklch(0.91_0.07_165)] text-[oklch(0.36_0.15_165)] border-[oklch(0.75_0.10_165)]',
  studio:
    'bg-[oklch(0.96_0.07_75)] text-[oklch(0.46_0.18_75)] border-[oklch(0.82_0.12_75)]',
};

const sizeClasses: Record<NonNullable<BadgeProps['size']>, string> = {
  sm: 'text-[10px] px-1.5 py-0.5',
  md: 'text-xs px-2 py-0.5',
};

export function Badge({ children, className, variant = 'default', size = 'md' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border font-medium',
        'transition-colors duration-150',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  );
}

export function CategoryBadge({ category }: { category: RoomCategory }) {
  const icons: Record<RoomCategory, string> = {
    classroom: '🎓',
    lab: '🔬',
    studio: '🎨',
  };
  return (
    <Badge variant={category} size="sm">
      {icons[category]} {getCategoryLabel(category)}
    </Badge>
  );
}

export function StatusBadge({ status }: { status: BookingStatus }) {
  const labels: Record<BookingStatus, string> = {
    active: 'Active',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };
  const dots: Record<BookingStatus, string> = {
    active: 'bg-[oklch(0.52_0.20_245)]',
    completed: 'bg-[oklch(0.46_0.15_155)]',
    cancelled: 'bg-[oklch(0.60_0_0)]',
  };
  return (
    <Badge variant={status}>
      <span className={cn('w-1.5 h-1.5 rounded-full', dots[status])} />
      {labels[status]}
    </Badge>
  );
}
