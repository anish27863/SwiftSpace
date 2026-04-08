import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { getTodayString, getCurrentTimeString } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');

    let query = supabase
      .from('bookings')
      .select(`
        *,
        room:rooms(*)
      `)
      .eq('user_id', user.id);

    if (status) {
      query = query.eq('status', status);
    }

    const { data: bookings, error } = await query
      .order('booking_date', { ascending: false })
      .order('start_time', { ascending: false });

    if (error) {
      console.error('Error fetching bookings:', error);
      return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
    }

    return NextResponse.json(bookings);

  } catch (error) {
    console.error('Unexpected error in GET /api/bookings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { room_id, booking_date, start_time, end_time, purpose } = body;

    // Basic validation
    if (!room_id || !booking_date || !start_time || !end_time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Prevent past bookings
    const today = getTodayString();
    if (booking_date < today) {
      return NextResponse.json({ error: 'Cannot book in the past' }, { status: 400 });
    }
    
    if (booking_date === today) {
      const currentTime = getCurrentTimeString();
      if (start_time < currentTime) {
        return NextResponse.json({ error: 'Cannot book a past time slot today' }, { status: 400 });
      }
    }

    // Supabase will handle the overlap check via the EXCLUDE constraint
    // But we can also do a quick check here if we want to return a nicer error message
    // before hitting the database constraint

    const { data, error } = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        room_id,
        booking_date,
        start_time,
        end_time,
        purpose,
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating booking:', error);
      // Check if it's the constraint violation error
      if (error.code === '23P01') { // PostgreSQL unique violation or exclude constraint
        return NextResponse.json({ error: 'This room is already booked for the selected time slot' }, { status: 409 });
      }
      return NextResponse.json({ error: error.message || 'Failed to create booking' }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });

  } catch (error) {
    console.error('Unexpected error in POST /api/bookings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
