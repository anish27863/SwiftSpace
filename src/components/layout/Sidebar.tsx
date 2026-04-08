'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  GraduationCap,
  Microscope,
  Palette,
  CalendarDays,
  LogOut,
  Settings,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/bookings', label: 'My Bookings', icon: CalendarDays },
  { href: '/rooms/classroom', label: 'Classrooms', icon: GraduationCap },
  { href: '/rooms/lab', label: 'Laboratories', icon: Microscope },
  { href: '/rooms/studio', label: 'Studios', icon: Palette },
];

export function Sidebar({ profile }: { profile?: any }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-[oklch(0.93_0.003_265)] bg-white md:flex">
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-[oklch(0.93_0.003_265)] px-6">
        <div className="h-8 w-8 rounded-lg bg-[oklch(0.58_0.25_285)] flex items-center justify-center text-white font-bold text-lg shadow-[var(--shadow-brand)]">
          S
        </div>
        <span className="font-bold text-xl tracking-tight text-[oklch(0.16_0.01_265)]">
          SwiftSpace
        </span>
      </div>

      <div className="flex-1 overflow-y-auto py-6">
        <nav className="flex flex-col gap-1 px-4">
          <p className="px-2 text-xs font-semibold uppercase tracking-wider text-[oklch(0.60_0.01_265)] mb-2 mt-4 first:mt-0">
            Main Menu
          </p>
          {navItems.slice(0, 2).map((item) => {
            const isActive = pathname === item.href;
            return (
              <NavItem
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                isActive={isActive}
              />
            );
          })}

          <p className="px-2 text-xs font-semibold uppercase tracking-wider text-[oklch(0.60_0.01_265)] mb-2 mt-8">
            Resources
          </p>
          {navItems.slice(2).map((item) => {
            const isActive = pathname === item.href;
            return (
              <NavItem
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                isActive={isActive}
              />
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-[oklch(0.93_0.003_265)] space-y-1">
        <Link
          href="/settings"
          className="flex w-full items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium text-[oklch(0.40_0.02_265)] transition-colors hover:bg-[oklch(0.97_0.003_265)] hover:text-[oklch(0.16_0.01_265)]"
        >
          <Settings className="h-[18px] w-[18px]" />
          Settings
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium text-[oklch(0.58_0.22_25)] transition-colors hover:bg-[oklch(0.98_0.03_25)]"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Logout
        </button>
      </div>
    </aside>
  );
}

function NavItem({
  href,
  label,
  icon: Icon,
  isActive,
}: {
  href: string;
  label: string;
  icon: any;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'group flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium transition-all duration-200',
        isActive
          ? 'bg-[oklch(0.95_0.03_285)] text-[oklch(0.42_0.24_285)]'
          : 'text-[oklch(0.40_0.02_265)] hover:bg-[oklch(0.97_0.003_265)] hover:text-[oklch(0.16_0.01_265)]'
      )}
    >
      <Icon
        className={cn(
          'h-[18px] w-[18px] transition-colors',
          isActive
            ? 'text-[oklch(0.58_0.25_285)]'
            : 'text-[oklch(0.60_0.01_265)] group-hover:text-[oklch(0.40_0.02_265)]'
        )}
      />
      {label}
    </Link>
  );
}
