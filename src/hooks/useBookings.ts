'use client';

import { useEffect, useState, useCallback } from 'react';
import type { Booking } from '@/lib/types';

interface UseBookingsOptions {
  status?: 'active' | 'completed' | 'cancelled';
  autoRefresh?: boolean; // Auto-refresh every 30 seconds
}

export function useBookings(options: UseBookingsOptions = {}) {
  const { status, autoRefresh = false } = options;
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (status) params.append('status', status);

      const response = await fetch(`/api/bookings?${params.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch bookings');
      }

      const data = await response.json();
      setBookings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchBookings();

    // Auto-refresh if enabled
    if (autoRefresh) {
      const interval = setInterval(fetchBookings, 30000); // Every 30 seconds
      return () => clearInterval(interval);
    }
  }, [fetchBookings, autoRefresh]);

  const cancelBooking = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel booking');
      }

      // Refresh bookings after cancellation
      await fetchBookings();
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to cancel booking';
      return { success: false, error: message };
    }
  };

  const createBooking = async (payload: {
    room_id: string;
    booking_date: string;
    start_time: string;
    end_time: string;
    purpose?: string;
  }) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create booking');
      }

      const data = await response.json();
      
      // Refresh bookings after creation
      await fetchBookings();
      
      return { success: true, data };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create booking';
      return { success: false, error: message };
    }
  };

  return {
    bookings,
    loading,
    error,
    refetch: fetchBookings,
    cancelBooking,
    createBooking,
  };
}
