-- ============================================================================
-- CAMPUS RESOURCE OPTIMIZER - DATABASE SCHEMA
-- ============================================================================
-- Run this in your Supabase SQL Editor
-- This creates all tables, functions, triggers, RLS policies, and sample data
-- ============================================================================

-- ============================================================================
-- 1. PROFILES TABLE (Extends Supabase Auth)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE public.profiles IS 'User profiles extending Supabase auth.users';

-- ============================================================================
-- 2. ROOMS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  room_number TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('classroom', 'lab', 'studio')),
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  description TEXT,
  image_url TEXT,
  amenities JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE public.rooms IS 'Campus rooms available for booking';
COMMENT ON COLUMN public.rooms.amenities IS 'Array of amenity strings stored as JSONB';
COMMENT ON COLUMN public.rooms.is_active IS 'Soft delete flag - inactive rooms are hidden from booking';

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_rooms_category ON public.rooms(category) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_rooms_active ON public.rooms(is_active);
CREATE INDEX IF NOT EXISTS idx_rooms_room_number ON public.rooms(room_number);

-- ============================================================================
-- 3. BOOKINGS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE NOT NULL,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  purpose TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Business logic constraints
  CONSTRAINT valid_time_range CHECK (end_time > start_time),
  CONSTRAINT future_or_today CHECK (booking_date >= CURRENT_DATE)
);

COMMENT ON TABLE public.bookings IS 'Room bookings with automatic conflict prevention';
COMMENT ON COLUMN public.bookings.status IS 'active: ongoing, completed: auto-completed after end time, cancelled: user cancelled';

-- Prevent overlapping bookings using exclusion constraint
-- This ensures no two active bookings for the same room overlap in time
CREATE EXTENSION IF NOT EXISTS btree_gist;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'no_overlap_bookings'
  ) THEN
    ALTER TABLE public.bookings ADD CONSTRAINT no_overlap_bookings
    EXCLUDE USING gist (
      room_id WITH =,
      booking_date WITH =,
      tsrange(
        (booking_date + start_time)::timestamp,
        (booking_date + end_time)::timestamp
      ) WITH &&
    ) WHERE (status = 'active');
  END IF;
END $$;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_room_id ON public.bookings(room_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_user_status ON public.bookings(user_id, status);
CREATE INDEX IF NOT EXISTS idx_bookings_room_date_status ON public.bookings(room_id, booking_date, status);

-- ============================================================================
-- 4. FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to automatically complete past bookings
CREATE OR REPLACE FUNCTION public.auto_complete_bookings()
RETURNS INTEGER AS $$
DECLARE
  completed_count INTEGER;
BEGIN
  UPDATE public.bookings
  SET status = 'completed',
      updated_at = NOW()
  WHERE status = 'active'
    AND (booking_date + end_time)::timestamp < NOW()
  RETURNING * INTO completed_count;
  
  GET DIAGNOSTICS completed_count = ROW_COUNT;
  RETURN completed_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.auto_complete_bookings IS 'Auto-completes bookings where end time has passed. Returns count of completed bookings.';

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_rooms_updated_at ON public.rooms;
CREATE TRIGGER update_rooms_updated_at 
  BEFORE UPDATE ON public.rooms
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_bookings_updated_at ON public.bookings;
CREATE TRIGGER update_bookings_updated_at 
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view active rooms" ON public.rooms;
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can create their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update their own active bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can cancel their own active bookings" ON public.bookings;

-- PROFILES POLICIES
CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- ROOMS POLICIES (Everyone can view active rooms)
CREATE POLICY "Anyone can view active rooms" 
  ON public.rooms FOR SELECT 
  USING (is_active = true);

-- BOOKINGS POLICIES
CREATE POLICY "Users can view their own bookings" 
  ON public.bookings FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings" 
  ON public.bookings FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own active bookings" 
  ON public.bookings FOR UPDATE 
  USING (auth.uid() = user_id AND status = 'active');

-- Note: Using UPDATE with status='cancelled' instead of DELETE for audit trail
CREATE POLICY "Users can cancel their own active bookings" 
  ON public.bookings FOR UPDATE 
  USING (
    auth.uid() = user_id 
    AND status = 'active'
    AND (booking_date + start_time)::timestamp > NOW()
  );

-- ============================================================================
-- 6. SAMPLE DATA
-- ============================================================================

-- Insert sample rooms
INSERT INTO public.rooms (name, room_number, category, capacity, description, amenities) VALUES
  (
    'Computer Lab A', 
    'CL-101', 
    'lab', 
    30, 
    'High-performance computing lab with latest software and hardware for programming, design, and data analysis.',
    '["Projector", "Whiteboard", "AC", "High-speed Internet", "30 Workstations", "Dual Monitors"]'::jsonb
  ),
  (
    'Lecture Hall 1', 
    'LH-201', 
    'classroom', 
    100, 
    'Large lecture hall with tiered seating, perfect for presentations and large classes.',
    '["Projector", "Audio System", "AC", "Microphone", "Document Camera", "Recording System"]'::jsonb
  ),
  (
    'Music Studio 1', 
    'MS-301', 
    'studio', 
    8, 
    'Professional soundproof recording studio with high-end audio equipment and instruments.',
    '["Recording Equipment", "Instruments", "Mixing Console", "Soundproofing", "Piano", "Drum Kit"]'::jsonb
  ),
  (
    'Physics Lab', 
    'PL-102', 
    'lab', 
    25, 
    'Well-equipped physics laboratory for experiments and research.',
    '["Lab Equipment", "Safety Gear", "Fume Hood", "Workbenches", "Storage Cabinets", "Emergency Shower"]'::jsonb
  ),
  (
    'Seminar Room 3', 
    'SR-202', 
    'classroom', 
    40, 
    'Medium-sized classroom with flexible seating arrangement for interactive sessions.',
    '["Projector", "Whiteboard", "AC", "Movable Desks", "Smart Board", "Video Conferencing"]'::jsonb
  ),
  (
    'Art Studio', 
    'AS-302', 
    'studio', 
    15, 
    'Spacious art studio with natural lighting and ample workspace for creative projects.',
    '["Easels", "Storage", "Sink", "Natural Light", "Drying Racks", "Pottery Wheel"]'::jsonb
  ),
  (
    'Chemistry Lab', 
    'CL-103', 
    'lab', 
    28, 
    'Modern chemistry laboratory with safety equipment and chemical storage.',
    '["Lab Equipment", "Fume Hoods", "Safety Showers", "Eye Wash Stations", "Chemical Storage", "Bunsen Burners"]'::jsonb
  ),
  (
    'Lecture Hall 2', 
    'LH-203', 
    'classroom', 
    80, 
    'Modern lecture hall with multimedia capabilities and comfortable seating.',
    '["Projector", "Audio System", "AC", "Wireless Mic", "Laptop Connectivity", "Whiteboard"]'::jsonb
  ),
  (
    'Photography Studio', 
    'PS-303', 
    'studio', 
    10, 
    'Professional photography studio with lighting equipment and backdrops.',
    '["Lighting Equipment", "Backdrops", "Cameras", "Props", "Editing Stations", "Green Screen"]'::jsonb
  ),
  (
    'Computer Lab B', 
    'CL-104', 
    'lab', 
    35, 
    'Advanced computing lab with specialized software for engineering and design.',
    '["Projector", "AC", "High-speed Internet", "35 Workstations", "3D Printers", "VR Equipment"]'::jsonb
  ),
  (
    'Small Classroom 1', 
    'SC-204', 
    'classroom', 
    20, 
    'Intimate classroom setting ideal for small group discussions and tutorials.',
    '["TV Screen", "Whiteboard", "AC", "Round Table", "Video Conferencing"]'::jsonb
  ),
  (
    'Video Production Studio', 
    'VS-304', 
    'studio', 
    6, 
    'Complete video production facility with cameras, lighting, and editing suite.',
    '["Cameras", "Lighting", "Green Screen", "Editing Suite", "Teleprompter", "Studio Monitors"]'::jsonb
  )
ON CONFLICT (room_number) DO NOTHING;

-- ============================================================================
-- 7. HELPER VIEWS (Optional but useful)
-- ============================================================================

-- View to see available rooms with booking counts
CREATE OR REPLACE VIEW public.rooms_with_stats AS
SELECT 
  r.*,
  COUNT(b.id) FILTER (WHERE b.status = 'active') as active_bookings_count,
  COUNT(b.id) FILTER (WHERE b.status = 'completed') as total_completed_bookings
FROM public.rooms r
LEFT JOIN public.bookings b ON r.id = b.room_id
GROUP BY r.id;

COMMENT ON VIEW public.rooms_with_stats IS 'Rooms with booking statistics';

-- ============================================================================
-- 8. INDEXES FOR PERFORMANCE
-- ============================================================================

-- Additional composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_bookings_user_date_status 
  ON public.bookings(user_id, booking_date DESC, status);

CREATE INDEX IF NOT EXISTS idx_bookings_active_future 
  ON public.bookings(booking_date, start_time) 
  WHERE status = 'active';

-- ============================================================================
-- 9. GRANT PERMISSIONS
-- ============================================================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant access to tables
GRANT SELECT ON public.rooms TO anon, authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.bookings TO authenticated;

-- Grant execute on functions
GRANT EXECUTE ON FUNCTION public.auto_complete_bookings() TO authenticated, service_role;

-- ============================================================================
-- SETUP COMPLETE!
-- ============================================================================
-- Next steps:
-- 1. Update your .env.local with Supabase credentials
-- 2. Run this SQL in your Supabase SQL Editor
-- 3. Verify tables are created in Table Editor
-- 4. Test authentication and RLS policies
-- ============================================================================
