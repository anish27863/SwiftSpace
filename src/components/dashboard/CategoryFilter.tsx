'use client';

import { RoomCategory } from '@/lib/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function CategoryFilter() {
  const pathname = usePathname();

  const tabs = [
    { name: 'All Rooms', href: '/' },
    { name: 'Classrooms', href: '/rooms/classroom' },
    { name: 'Laboratories', href: '/rooms/lab' },
    { name: 'Studios', href: '/rooms/studio' },
  ];

  return (
    <div className="flex border-b border-[oklch(0.93_0.003_265)] mb-6 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.name}
            href={tab.href!}
            className={cn(
              'px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors relative',
              isActive
                ? 'border-[oklch(0.58_0.25_285)] text-[oklch(0.16_0.01_265)]'
                : 'border-transparent text-[oklch(0.50_0.01_265)] hover:text-[oklch(0.16_0.01_265)] hover:border-[oklch(0.85_0.005_265)]'
            )}
          >
            {tab.name}
            {isActive && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[oklch(0.58_0.25_285)] shadow-[var(--shadow-glow)]" />
            )}
          </Link>
        );
      })}
    </div>
  );
}
