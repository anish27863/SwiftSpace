import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
}

export function Skeleton({ className, width, height }: SkeletonProps) {
  return (
    <div
      className={cn('skeleton', className)}
      style={{ width, height }}
    />
  );
}

export function RoomCardSkeleton() {
  return (
    <div className="rounded-[var(--radius-xl)] bg-white border border-[oklch(0.93_0.003_265)] shadow-[var(--shadow-card)] overflow-hidden animate-fade-in">
      <Skeleton className="w-full h-44" />
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1.5 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-9 w-full rounded-[var(--radius-md)]" />
      </div>
    </div>
  );
}

export function BookingCardSkeleton() {
  return (
    <div className="rounded-[var(--radius-xl)] bg-white border border-[oklch(0.93_0.003_265)] shadow-[var(--shadow-card)] p-5 animate-fade-in">
      <div className="flex gap-4">
        <Skeleton className="w-14 h-14 rounded-[var(--radius-lg)] shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-[var(--radius-xl)] bg-white border border-[oklch(0.93_0.003_265)] shadow-[var(--shadow-card)] p-5">
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-9 w-9 rounded-[var(--radius-md)]" />
      </div>
      <Skeleton className="h-8 w-16 mb-1" />
      <Skeleton className="h-3 w-28" />
    </div>
  );
}
