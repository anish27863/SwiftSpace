import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Auto-complete endpoint for Vercel Cron Jobs
 * This endpoint automatically marks bookings as 'completed' when their end time has passed.
 * 
 * Security: Protected by a CRON_SECRET to prevent unauthorized access
 * Schedule: Runs every 15 minutes via Vercel Cron (configured in vercel.json)
 */
export async function POST(request: NextRequest) {
  try {
    // Verify cron secret from authorization header
    const authHeader = request.headers.get('authorization');
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;
    
    if (authHeader !== expectedAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();

    // Call the Supabase function to auto-complete bookings
    const { data, error } = await supabase.rpc('auto_complete_bookings');

    if (error) {
      console.error('Error auto-completing bookings:', error);
      return NextResponse.json(
        { error: 'Failed to auto-complete bookings', details: error.message },
        { status: 500 }
      );
    }

    const completedCount = data || 0;
    
    console.log(`[Auto-Complete] Successfully completed ${completedCount} booking(s)`);
    
    return NextResponse.json({
      success: true,
      completed_count: completedCount,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Unexpected error in POST /api/auto-complete:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * GET endpoint for manual triggering (development only)
 * Remove or secure this in production!
 */
export async function GET() {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 404 });
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc('auto_complete_bookings');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      completed_count: data || 0,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in GET /api/auto-complete:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
