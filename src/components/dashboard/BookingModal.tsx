'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useToast } from '@/components/ui/toast';
import type { Room, Booking } from '@/lib/types';
import {
  generateTimeSlots,
  getTodayString,
  formatTime,
  compareTime,
  getCategoryIcon,
} from '@/lib/utils';
import { Calendar, Clock, MapPin, Users, AlertCircle } from 'lucide-react';

interface BookingModalProps {
  room: Room | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function BookingModal({ room, open, onClose, onSuccess }: BookingModalProps) {
  const [date, setDate] = useState(getTodayString());
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [purpose, setPurpose] = useState('');
  const [loading, setLoading] = useState(false);
  const [existingBookings, setExistingBookings] = useState<Booking[]>([]);
  const [fetchingBookings, setFetchingBookings] = useState(false);
  
  const { showToast } = useToast();
  const timeSlots = generateTimeSlots(7, 22);

  // Fetch existing bookings when date changes
  useEffect(() => {
    if (!room || !date) return;

    const fetchBookings = async () => {
      setFetchingBookings(true);
      try {
        const response = await fetch(
          `/api/bookings?room_id=${room.id}&date=${date}&status=active`
        );
        if (response.ok) {
          const data = await response.json();
          setExistingBookings(data);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setFetchingBookings(false);
      }
    };

    fetchBookings();
  }, [room, date]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setDate(getTodayString());
      setStartTime('09:00');
      setEndTime('10:00');
      setPurpose('');
      setExistingBookings([]);
    }
  }, [open]);

  // Validate time selection
  const isTimeConflict = () => {
    if (compareTime(startTime, endTime) >= 0) {
      return true;
    }

    // Check against existing bookings
    return existingBookings.some((booking) => {
      const bookingStart = booking.start_time.substring(0, 5); // HH:MM
      const bookingEnd = booking.end_time.substring(0, 5);
      
      // Check if times overlap
      return (
        (startTime >= bookingStart && startTime < bookingEnd) ||
        (endTime > bookingStart && endTime <= bookingEnd) ||
        (startTime <= bookingStart && endTime >= bookingEnd)
      );
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!room) return;

    if (compareTime(startTime, endTime) >= 0) {
      showToast({
        type: 'error',
        title: 'Invalid Time',
        message: 'End time must be after start time',
      });
      return;
    }

    if (isTimeConflict()) {
      showToast({
        type: 'error',
        title: 'Time Conflict',
        message: 'This time slot overlaps with an existing booking',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          room_id: room.id,
          booking_date: date,
          start_time: startTime,
          end_time: endTime,
          purpose: purpose || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create booking');
      }

      showToast({
        type: 'success',
        title: 'Booking Created!',
        message: `${room.name} booked successfully`,
      });

      onSuccess();
      onClose();
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Booking Failed',
        message: error instanceof Error ? error.message : 'Failed to create booking',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!room) return null;

  const hasConflict = isTimeConflict();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-3xl">{getCategoryIcon(room.category)}</span>
            <div>
              <div className="text-xl font-bold text-[oklch(0.16_0.015_270)]">Book {room.name}</div>
              <div className="text-sm font-normal text-[oklch(0.50_0.01_265)] flex items-center gap-2 mt-1">
                <MapPin className="w-4 h-4" />
                {room.room_number}
                <span className="mx-2">•</span>
                <Users className="w-4 h-4" />
                Capacity: {room.capacity}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Date Selection */}
          <div>
            <Input
              type="date"
              label="Date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={getTodayString()}
              leftIcon={<Calendar className="w-4 h-4" />}
              required
            />
          </div>

          {/* Time Selection */}
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Start Time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            >
              {timeSlots.map((slot) => (
                <option key={slot.value} value={slot.value}>
                  {slot.label}
                </option>
              ))}
            </Select>

            <Select
              label="End Time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            >
              {timeSlots.map((slot) => (
                <option key={slot.value} value={slot.value}>
                  {slot.label}
                </option>
              ))}
            </Select>
          </div>

          {/* Conflict Warning */}
          {hasConflict && (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-[oklch(0.95_0.04_25)] border border-[oklch(0.85_0.08_25)]">
              <AlertCircle className="w-5 h-5 text-[oklch(0.58_0.22_25)] flex-shrink-0 mt-0.5" />
              <div className="text-sm text-[oklch(0.30_0.015_270)]">
                <p className="font-semibold mb-1">Time conflict detected</p>
                <p>This time slot overlaps with an existing booking or the end time is before the start time.</p>
              </div>
            </div>
          )}

          {/* Purpose */}
          <div>
            <Input
              type="text"
              label="Purpose (Optional)"
              placeholder="e.g., Team meeting, Study session, Lab work"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              maxLength={200}
            />
            <p className="text-xs text-[oklch(0.60_0.01_265)] mt-1">
              {purpose.length}/200 characters
            </p>
          </div>

          {/* Existing Bookings Timeline */}
          {existingBookings.length > 0 && (
            <div className="p-4 rounded-lg bg-[oklch(0.98_0.005_280)] border border-[oklch(0.93_0.003_265)]">
              <h4 className="text-sm font-semibold text-[oklch(0.16_0.015_270)] mb-3">
                Existing Bookings for {date}
              </h4>
              <div className="space-y-2">
                {existingBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center gap-3 text-sm p-2 rounded bg-white border border-[oklch(0.90_0.005_265)]"
                  >
                    <Clock className="w-4 h-4 text-[oklch(0.58_0.25_285)]" />
                    <span className="font-medium">
                      {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                    </span>
                    {booking.purpose && (
                      <>
                        <span className="text-[oklch(0.70_0.03_265)]">•</span>
                        <span className="text-[oklch(0.50_0.01_265)] truncate">
                          {booking.purpose}
                        </span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-[oklch(0.93_0.003_265)]">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={hasConflict || fetchingBookings}
              className="flex-1"
            >
              Confirm Booking
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
