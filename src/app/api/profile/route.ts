import { createClient, createAdminClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
 
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Verify the user is actually authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
 
    const body = await request.json();
    const { full_name } = body;
 
    if (!full_name) {
      return NextResponse.json({ error: 'Full name is required' }, { status: 400 });
    }
 
    // Use the admin client to bypass Row Level Security.
    // This allows upserting (inserting) a profile when the trigger failed
    // to create one initially (e.g. account created prior to schema setup).
    const adminSupabase = await createAdminClient();
    
    const { error: upsertError } = await adminSupabase
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email,
        full_name,
        updated_at: new Date().toISOString()
      });
 
    if (upsertError) {
      console.error('Bypass RLS Profile Upsert Error:', upsertError);
      return NextResponse.json({ error: upsertError.message }, { status: 500 });
    }
 
    return NextResponse.json({ success: true });
 
  } catch (error) {
    console.error('Profile Update Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
