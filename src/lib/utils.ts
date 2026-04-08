import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { TimeSlot, RoomCategory } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Generate 30-minute time slots from startHour to endHour */
export function generateTimeSlots(startHour = 7, endHour = 22): TimeSlot[] {
  const slots: TimeSlot[] = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    for (const minute of [0, 30]) {
      if (hour === endHour && minute > 0) break;
      const h24 = hour.toString().padStart(2, '0');
      const m = minute.toString().padStart(2, '0');
      const value = `${h24}:${m}`;
      const period = hour < 12 ? 'AM' : 'PM';
      const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const label = `${h12.toString().padStart(2, '0')}:${m} ${period}`;
      slots.push({ value, label });
    }
  }
  return slots;
}

/** Format a booking_date (YYYY-MM-DD) + time (HH:MM or HH:MM:SS) to a readable string */
export function formatDateTime(date: string, time: string): string {
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  const d = new Date(year, month - 1, day, hour, minute);
  return d.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/** Format just the time portion */
export function formatTime(time: string): string {
  const [hour, minute] = time.split(':').map(Number);
  const period = hour < 12 ? 'AM' : 'PM';
  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${h12}:${minute.toString().padStart(2, '0')} ${period}`;
}

/** Format date to a readable string */
export function formatDate(date: string): string {
  const [year, month, day] = date.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** Get today's date as YYYY-MM-DD in local time */
export function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Get current local time as HH:MM */
export function getCurrentTimeString(): string {
  const now = new Date();
  return now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
}

/** Check if a booking is in the past */
export function isBookingPast(bookingDate: string, endTime: string): boolean {
  const [year, month, day] = bookingDate.split('-').map(Number);
  const [hour, minute] = endTime.split(':').map(Number);
  const bookingEnd = new Date(year, month - 1, day, hour, minute);
  return bookingEnd < new Date();
}

/** Get category display name */
export function getCategoryLabel(category: RoomCategory): string {
  const map: Record<RoomCategory, string> = {
    classroom: 'Classroom',
    lab: 'Lab',
    studio: 'Studio',
  };
  return map[category];
}

/** Get category gradient class */
export function getCategoryGradient(category: RoomCategory): string {
  const map: Record<RoomCategory, string> = {
    classroom: 'from-violet-600 to-indigo-700',
    lab: 'from-emerald-500 to-teal-700',
    studio: 'from-amber-500 to-orange-600',
  };
  return map[category];
}

/** Get category icon emoji */
export function getCategoryIcon(category: RoomCategory): string {
  const map: Record<RoomCategory, string> = {
    classroom: '🎓',
    lab: '🔬',
    studio: '🎨',
  };
  return map[category];
}

/** Compare two time strings HH:MM or HH:MM:SS */
export function compareTime(a: string, b: string): number {
  const [ah, am] = a.split(':').map(Number);
  const [bh, bm] = b.split(':').map(Number);
  const aTotal = ah * 60 + am;
  const bTotal = bh * 60 + bm;
  return aTotal - bTotal;
}

/** Add minutes to a time string HH:MM */
export function addMinutesToTime(time: string, minutes: number): string {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + minutes;
  const newH = Math.floor(total / 60) % 24;
  const newM = total % 60;
  return `${newH.toString().padStart(2, '0')}:${newM.toString().padStart(2, '0')}`;
}
