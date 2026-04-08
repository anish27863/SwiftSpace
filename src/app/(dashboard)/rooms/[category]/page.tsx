'use client';

import { use } from 'react';
import { useState } from 'react';
import { useRooms } from '@/hooks/useRooms';
import { RoomCard } from '@/components/dashboard/RoomCard';
import { BookingModal } from '@/components/dashboard/BookingModal';
import type { Room, RoomCategory } from '@/lib/types';
import { Search, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getCategoryLabel, getCategoryIcon } from '@/lib/utils';
import Link from 'next/link';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { category } = use(params);
  const categoryType = category as RoomCategory;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  const { rooms, loading, error, refetch } = useRooms({ category: categoryType });

  // Filter rooms by search query
  const filteredRooms = rooms.filter((room) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      room.name.toLowerCase().includes(query) ||
      room.room_number.toLowerCase().includes(query) ||
      room.description?.toLowerCase().includes(query)
    );
  });

  const handleBookRoom = (room: Room) => {
    setSelectedRoom(room);
    setBookingModalOpen(true);
  };

  const handleBookingSuccess = () => {
    refetch();
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-[oklch(0.99_0.002_280)] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link 
              href="/"
              className="inline-flex items-center text-[oklch(0.40_0.02_265)] hover:bg-[oklch(0.95_0.003_265)] h-8 px-3 text-xs gap-1.5 mb-4 rounded-md transition-colors w-fit"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to All Rooms
            </Link>
            
            <div className="flex items-center gap-3 mb-3">
              <span className="text-5xl">{getCategoryIcon(categoryType)}</span>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-[oklch(0.16_0.015_270)] tracking-tight">
                  {getCategoryLabel(categoryType)}s
                </h1>
                <p className="text-[oklch(0.50_0.01_265)] text-sm sm:text-base mt-1">
                  Browse available {categoryType}s across campus
                </p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="mb-8 max-w-md">
            <Input
              type="text"
              placeholder="Search rooms by name or number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          {/* Error State */}
          {error && (
            <div className="p-6 rounded-xl bg-[oklch(0.95_0.04_25)] border border-[oklch(0.85_0.08_25)] text-[oklch(0.30_0.015_270)]">
              <p className="font-semibold mb-1">Error loading rooms</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-48 w-full rounded-xl" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          )}

          {/* Rooms Grid */}
          {!loading && !error && (
            <>
              {filteredRooms.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 rounded-full bg-[oklch(0.97_0.01_280)] flex items-center justify-center mx-auto mb-4">
                    <Search className="w-10 h-10 text-[oklch(0.70_0.03_265)]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[oklch(0.16_0.015_270)] mb-2">
                    No rooms found
                  </h3>
                  <p className="text-[oklch(0.50_0.01_265)]">
                    {searchQuery
                      ? 'Try adjusting your search query'
                      : `No ${categoryType}s available at the moment`}
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-4 text-sm text-[oklch(0.50_0.01_265)]">
                    Showing {filteredRooms.length} {filteredRooms.length === 1 ? 'room' : 'rooms'}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRooms.map((room) => (
                      <RoomCard key={room.id} room={room} onBook={handleBookRoom} />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        room={selectedRoom}
        open={bookingModalOpen}
        onClose={() => {
          setBookingModalOpen(false);
          setSelectedRoom(null);
        }}
        onSuccess={handleBookingSuccess}
      />
    </>
  );
}
