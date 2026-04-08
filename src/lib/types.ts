export type RoomCategory = 'classroom' | 'lab' | 'studio';
export type BookingStatus = 'active' | 'completed' | 'cancelled';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface Room {
  id: string;
  name: string;
  room_number: string;
  category: RoomCategory;
  capacity: number;
  description: string | null;
  image_url: string | null;
  amenities: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  room_id: string;
  booking_date: string; // YYYY-MM-DD
  start_time: string;   // HH:MM:SS
  end_time: string;     // HH:MM:SS
  status: BookingStatus;
  purpose: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  room?: Room;
}

export interface TimeSlot {
  label: string; // "09:00 AM"
  value: string; // "09:00"
}

export interface AvailabilitySlot {
  start_time: string;
  end_time: string;
  is_booked: boolean;
  booking_id?: string;
}

// API response types
export interface ApiError {
  error: string;
  code?: string;
}

export interface CreateBookingPayload {
  room_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  purpose?: string;
}

export interface RoomWithAvailability extends Room {
  is_available?: boolean;
  active_bookings_count?: number;
}
