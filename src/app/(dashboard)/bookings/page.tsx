'use client';

import { useState } from 'react';
import { useBookings } from '@/hooks/useBookings';
import { BookingCard } from '@/components/dashboard/BookingCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/toast';
import { Calendar, Clock, XCircle } from 'lucide-react';
import type { BookingStatus } from '@/lib/types';

const tabs: { value: BookingStatus | 'all'; label: string; icon: React.ReactNode }[] = [
  { value: 'all', label: 'All Bookings', icon: <Calendar className="w-4 h-4" /> },
  { value: 'active', label: 'Active', icon: <Clock className="w-4 h-4" /> },
  { value: 'completed', label: 'Completed', icon: <Calendar className="w-4 h-4" /> },
  { value: 'cancelled', label: 'Cancelled', icon: <XCircle className="w-4 h-4" /> },
];

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState<BookingStatus | 'all'>('all');
  const { showToast } = useToast();

  const { bookings, loading, error, refetch, cancelBooking } = useBookings({
    status: activeTab === 'all' ? undefined : activeTab,
    autoRefresh: true, // Auto-refresh every 30 seconds
  });

  const handleCancelBooking = async (bookingId: string) => {
    const result = await cancelBooking(bookingId);
    
    if (result.success) {
      showToast({
        type: 'success',
        title: 'Booking Cancelled',
        message: 'Your booking has been cancelled successfully',
      });
    } else {
      showToast({
        type: 'error',
        title: 'Cancellation Failed',
        message: result.error || 'Failed to cancel booking',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[oklch(0.99_0.002_280)] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[oklch(0.16_0.015_270)] tracking-tight mb-2">
            My Bookings
          </h1>
          <p className="text-[oklch(0.50_0.01_265)] text-sm sm:text-base">
            Manage your room bookings and view booking history
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <Button
              key={tab.value}
              variant={activeTab === tab.value ? 'primary' : 'outline'}
              size="md"
              onClick={() => setActiveTab(tab.value)}
            >
              {tab.icon}
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Error State */}
        {error && (
          <div className="p-6 rounded-xl bg-[oklch(0.95_0.04_25)] border border-[oklch(0.85_0.08_25)] text-[oklch(0.30_0.015_270)]">
            <p className="font-semibold mb-1">Error loading bookings</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 rounded-xl bg-white border border-[oklch(0.93_0.003_265)] space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bookings List */}
        {!loading && !error && (
          <>
            {bookings.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 rounded-full bg-[oklch(0.97_0.01_280)] flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-10 h-10 text-[oklch(0.70_0.03_265)]" />
                </div>
                <h3 className="text-xl font-semibold text-[oklch(0.16_0.015_270)] mb-2">
                  No bookings found
                </h3>
                <p className="text-[oklch(0.50_0.01_265)] mb-6">
                  {activeTab === 'all'
                    ? "You haven't made any bookings yet"
                    : `You don't have any ${activeTab} bookings`}
                </p>
                <Button variant="primary" onClick={() => window.location.href = '/'}>
                  Browse Rooms
                </Button>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-[oklch(0.50_0.01_265)]">
                  {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'}
                </div>
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      onCancel={handleCancelBooking}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
