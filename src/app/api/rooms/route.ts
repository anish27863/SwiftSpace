import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const availableDate = searchParams.get('date');
    const startTime = searchParams.get('start_time');
    const endTime = searchParams.get('end_time');

    let query = supabase.from('rooms').select('*').eq('is_active', true);

    if (category) {
      query = query.eq('category', category);
    }

    const { data: rooms, error } = await query.order('name');

    if (error) {
      console.error('Error fetching rooms:', error);
      return NextResponse.json({ error: 'Failed to fetch rooms' }, { status: 500 });
    }

    // Fast path: if no specific availability check is requested, return rooms
    if (!availableDate || !startTime || !endTime) {
      return NextResponse.json(rooms);
    }

    // Availability check
    const { data: overlappingBookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('room_id')
      .eq('booking_date', availableDate)
      .eq('status', 'active')
      .lt('start_time', endTime)
      .gt('end_time', startTime);

    if (bookingsError) {
      console.error('Error fetching bookings for availability check:', bookingsError);
      return NextResponse.json({ error: 'Failed to check availability' }, { status: 500 });
    }

    const bookedRoomIds = new Set(overlappingBookings.map(b => b.room_id));

    const roomsWithAvailability = rooms.map(room => ({
      ...room,
      is_available: !bookedRoomIds.has(room.id)
    }));

    return NextResponse.json(roomsWithAvailability);

  } catch (error) {
    console.error('Unexpected error in GET /api/rooms:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
