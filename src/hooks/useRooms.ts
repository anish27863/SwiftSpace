'use client';

import { useEffect, useState, useCallback } from 'react';
import type { Room, RoomCategory, RoomWithAvailability } from '@/lib/types';

interface UseRoomsOptions {
  category?: RoomCategory;
  availabilityCheck?: {
    date: string;
    start_time: string;
    end_time: string;
  };
}

export function useRooms(options: UseRoomsOptions = {}) {
  const { category, availabilityCheck } = options;
  const [rooms, setRooms] = useState<RoomWithAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (availabilityCheck) {
        params.append('date', availabilityCheck.date);
        params.append('start_time', availabilityCheck.start_time);
        params.append('end_time', availabilityCheck.end_time);
      }

      const response = await fetch(`/api/rooms?${params.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch rooms');
      }

      const data = await response.json();
      setRooms(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching rooms:', err);
    } finally {
      setLoading(false);
    }
  }, [category, availabilityCheck]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // Filter rooms client-side (useful for additional filtering)
  const filterByAvailability = useCallback(
    (onlyAvailable: boolean) => {
      if (!onlyAvailable) return rooms;
      return rooms.filter((room) => room.is_available !== false);
    },
    [rooms]
  );

  // Search rooms by name or room number
  const searchRooms = useCallback(
    (query: string) => {
      if (!query.trim()) return rooms;
      const lowerQuery = query.toLowerCase();
      return rooms.filter(
        (room) =>
          room.name.toLowerCase().includes(lowerQuery) ||
          room.room_number.toLowerCase().includes(lowerQuery) ||
          room.description?.toLowerCase().includes(lowerQuery)
      );
    },
    [rooms]
  );

  return {
    rooms,
    loading,
    error,
    refetch: fetchRooms,
    filterByAvailability,
    searchRooms,
  };
}
