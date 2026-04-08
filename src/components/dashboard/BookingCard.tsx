'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Booking } from '@/lib/types';
import { Calendar, Clock, MapPin, Tag, X } from 'lucide-react';
import { formatDate, formatTime, isBookingPast, getCategoryIcon } from '@/lib/utils';
import { useState } from 'react';

interface BookingCardProps {
  booking: Booking;
  onCancel?: (bookingId: string) => Promise<void>;
}

export function BookingCard({ booking, onCancel }: BookingCardProps) {
  const [cancelling, setCancelling] = useState(false);
  const isPast = isBookingPast(booking.booking_date, booking.end_time);
  const canCancel = booking.status === 'active' && !isPast && onCancel;

  const handleCancel = async () => {
    if (!onCancel) return;
    
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    setCancelling(true);
    try {
      await onCancel(booking.id);
    } finally {
      setCancelling(false);
    }
  };

  const statusConfig = {
    active: {
      label: 'Active',
      className: 'bg-[oklch(0.60_0.18_255)] text-white',
    },
    completed: {
      label: 'Completed',
      className: 'bg-[oklch(0.60_0.18_155)] text-white',
    },
    cancelled: {
      label: 'Cancelled',
      className: 'bg-[oklch(0.70_0.03_265)] text-[oklch(0.40_0.02_265)]',
    },
  };

  const config = statusConfig[booking.status];

  return (
    <Card hover className="overflow-hidden animate-fade-in">
      <CardHeader className="relative pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-2xl">{booking.room ? getCategoryIcon(booking.room.category) : '🏢'}</span>
              <h3 className="font-semibold text-lg text-[oklch(0.16_0.015_270)] truncate">
                {booking.room?.name || 'Room'}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-[oklch(0.50_0.01_265)]">
              <MapPin className="w-4 h-4" />
              <span>{booking.room?.room_number}</span>
            </div>
          </div>
          <Badge className={config.className}>
            {config.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Date and Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[oklch(0.97_0.01_280)] flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[oklch(0.58_0.25_285)]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[oklch(0.60_0.01_265)] uppercase tracking-wide mb-0.5">
                Date
              </p>
              <p className="text-sm font-semibold text-[oklch(0.16_0.015_270)] truncate">
                {formatDate(booking.booking_date)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[oklch(0.97_0.01_280)] flex items-center justify-center">
              <Clock className="w-5 h-5 text-[oklch(0.58_0.25_285)]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[oklch(0.60_0.01_265)] uppercase tracking-wide mb-0.5">
                Time
              </p>
              <p className="text-sm font-semibold text-[oklch(0.16_0.015_270)]">
                {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
              </p>
            </div>
          </div>
        </div>

        {/* Purpose */}
        {booking.purpose && (
          <div className="flex items-start gap-3 p-3 rounded-lg bg-[oklch(0.98_0.005_280)]">
            <Tag className="w-4 h-4 text-[oklch(0.58_0.25_285)] mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[oklch(0.60_0.01_265)] uppercase tracking-wide mb-1">
                Purpose
              </p>
              <p className="text-sm text-[oklch(0.30_0.015_270)]">
                {booking.purpose}
              </p>
            </div>
          </div>
        )}

        {/* Room Details */}
        {booking.room && (
          <div className="flex items-center gap-4 pt-3 border-t border-[oklch(0.93_0.003_265)]">
            <div className="flex items-center gap-2 text-sm text-[oklch(0.50_0.01_265)]">
              <span className="font-medium">Capacity:</span>
              <span>{booking.room.capacity} people</span>
            </div>
          </div>
        )}

        {/* Cancel Button */}
        {canCancel && (
          <div className="pt-3 border-t border-[oklch(0.93_0.003_265)]">
            <Button
              variant="destructive"
              size="sm"
              onClick={handleCancel}
              loading={cancelling}
              className="w-full sm:w-auto"
            >
              <X className="w-4 h-4" />
              Cancel Booking
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
