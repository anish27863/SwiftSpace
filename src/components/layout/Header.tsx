import Link from 'next/link';
import { Search, LogOut, Bell } from 'lucide-react';


export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[oklch(0.93_0.003_265)] bg-white/80 px-4 md:px-6 glass backdrop-blur-md">
      <div className="flex md:hidden items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-[oklch(0.58_0.25_285)] flex items-center justify-center text-white font-bold text-lg">
          S
        </div>
        <span className="font-semibold text-lg tracking-tight">SwiftSpace</span>
      </div>

      <div className="hidden md:flex ml-4 flex-1 max-w-md items-center relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[oklch(0.60_0.01_265)]" />
        <input
          type="text"
          placeholder="Search rooms..."
          className="h-10 w-full rounded-full border border-[oklch(0.93_0.003_265)] bg-[oklch(0.97_0.003_265)] pl-10 pr-4 text-sm outline-none transition-all focus:border-[oklch(0.58_0.25_285)] focus:bg-white focus:ring-2 focus:ring-[oklch(0.58_0.25_285)_/_0.2]"
        />
      </div>

      <div className="flex items-center gap-3">
        <button className="flex h-10 w-10 items-center justify-center rounded-full border border-[oklch(0.93_0.003_265)] bg-white hover:bg-[oklch(0.97_0.003_265)] text-[oklch(0.40_0.02_265)] transition-colors">
          <Bell className="h-[18px] w-[18px]" />
        </button>
        <div className="h-10 w-10 rounded-full bg-[oklch(0.93_0.04_280)] flex items-center justify-center text-[oklch(0.42_0.24_285)] font-semibold border border-[oklch(0.87_0.08_280)]">
          U
        </div>
      </div>
    </header>
  );
}
