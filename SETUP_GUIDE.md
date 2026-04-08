# 📋 Setup Guide - Campus Resource Optimizer

This guide will walk you through setting up the Campus Resource Optimizer from scratch.

## Prerequisites

Before you begin, ensure you have:

- ✅ Node.js 18 or higher installed
- ✅ npm (comes with Node.js)
- ✅ A Supabase account (free tier works great!)
- ✅ Git installed (for version control)
- ✅ A code editor (VS Code recommended)

## Step-by-Step Setup

### 1️⃣ Install Dependencies

```bash
cd swiftspace
npm install
```

This will install all required packages including Next.js, React, TypeScript, Tailwind CSS, Supabase client, and more.

### 2️⃣ Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/sign in
2. Click "New Project"
3. Fill in:
   - **Project Name**: Campus Resource Optimizer
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is perfect for getting started
4. Click "Create new project"
5. Wait 1-2 minutes for project initialization

### 3️⃣ Set Up Database Schema

1. In your Supabase project, go to **SQL Editor**
2. Click "New Query"
3. Open the `supabase-schema.sql` file from this project
4. Copy ALL contents and paste into the SQL Editor
5. Click "Run" (or press Ctrl+Enter / Cmd+Enter)
6. Wait for execution to complete (you should see "Success" messages)

**What this does:**
- Creates `profiles`, `rooms`, and `bookings` tables
- Sets up Row Level Security (RLS) policies
- Creates database functions for auto-completion
- Adds triggers for timestamp management
- Inserts 12 sample rooms for testing
- Creates indexes for performance

### 4️⃣ Verify Database Setup

1. Go to **Table Editor** in Supabase dashboard
2. You should see three tables: `profiles`, `rooms`, `bookings`
3. Click on `rooms` table - you should see 12 sample rooms
4. If you see the rooms, database setup is complete! ✅

### 5️⃣ Get Supabase Credentials

1. Go to **Settings** → **API** in your Supabase project
2. Find and copy these values:
   - **Project URL** (looks like: `https://xxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)
   - **service_role** key (another long string - keep this secret!)

### 6️⃣ Configure Environment Variables

1. In your project root, find `.env.example`
2. Copy it to create `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

3. Open `.env.local` and fill in your values:

```bash
# Replace these with your actual Supabase values
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Generate a random secret for cron job security
CRON_SECRET=your-random-secret-here-make-it-long-and-secure

# Keep this as is for local development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Generating a CRON_SECRET:**
- Option 1: Use a password generator (40+ characters recommended)
- Option 2: Run in terminal: `openssl rand -base64 32`
- Option 3: Visit [randomkeygen.com](https://randomkeygen.com)

### 7️⃣ Start Development Server

```bash
npm run dev
```

You should see:
```
▲ Next.js 16.2.2
- Local:        http://localhost:3000
- Ready in 1.2s
```

### 8️⃣ Test the Application

1. Open [http://localhost:3000](http://localhost:3000)
2. You should see the main dashboard
3. Click **Sign up** to create an account
4. Fill in email and password
5. You'll be automatically logged in!

### 9️⃣ Verify Everything Works

#### Test Authentication:
- ✅ Sign up with a new account
- ✅ Log out
- ✅ Log in again
- ✅ Try accessing `/bookings` (should work when logged in)

#### Test Room Browsing:
- ✅ See 12 sample rooms on the dashboard
- ✅ Click category filters (Classrooms, Labs, Studios)
- ✅ Use search to find specific rooms

#### Test Booking Creation:
- ✅ Click "Book Now" on any room
- ✅ Select a date (today or future)
- ✅ Choose start and end times
- ✅ Add a purpose (optional)
- ✅ Click "Confirm Booking"
- ✅ Should see success message!

#### Test Bookings Page:
- ✅ Go to `/bookings`
- ✅ See your newly created booking
- ✅ Try to cancel it (click Cancel Booking button)
- ✅ Confirm cancellation

#### Test Overlap Prevention:
- ✅ Try to book the same room at the same time
- ✅ Should see "Time conflict detected" error ✅

## 🚀 Deploy to Vercel (Optional)

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Campus Resource Optimizer"
git branch -M main
git remote add origin https://github.com/yourusername/swiftspace.git
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings
5. **Add Environment Variables**:
   - Click "Environment Variables"
   - Add all variables from `.env.local` (except `NEXT_PUBLIC_APP_URL`)
   - Make sure to add `CRON_SECRET`!
6. Click "Deploy"
7. Wait 2-3 minutes for deployment

### 3. Update App URL

After deployment:
1. Copy your Vercel URL (e.g., `https://swiftspace.vercel.app`)
2. In Vercel dashboard → Settings → Environment Variables
3. Add `NEXT_PUBLIC_APP_URL` with your Vercel URL
4. Redeploy the app

### 4. Verify Cron Job

1. In Vercel dashboard → Cron Jobs
2. You should see `/api/auto-complete` scheduled for every 15 minutes
3. Check logs after 15 minutes to verify it's running

## 🛠️ Troubleshooting

### "Failed to fetch rooms" error

**Cause**: Supabase credentials incorrect or RLS policies not set

**Solution**:
1. Double-check `.env.local` credentials
2. Verify `supabase-schema.sql` ran successfully
3. Check Supabase dashboard → Table Editor → Policies

### "Unauthorized" when accessing pages

**Cause**: Not logged in or session expired

**Solution**:
1. Log out and log in again
2. Clear browser cookies
3. Check middleware is configured (it should be!)

### Rooms not showing up

**Cause**: Sample data not inserted or RLS blocking access

**Solution**:
1. Check Supabase Table Editor → rooms (should have 12 rows)
2. Re-run the INSERT section from `supabase-schema.sql`
3. Verify RLS policy allows public read on active rooms

### Bookings auto-complete not working (local dev)

**Normal behavior**: Auto-completion only works via Vercel Cron in production

**For testing locally**:
1. Open `src/app/api/auto-complete/route.ts`
2. The GET endpoint works in development (POST is for cron)
3. Visit `http://localhost:3000/api/auto-complete` to manually trigger

### TypeScript errors

**Solution**:
```bash
npm run build
```
This will show all TypeScript errors. Fix them and restart dev server.

## 📚 Next Steps

Once setup is complete:

1. **Customize the app**:
   - Change colors in Tailwind config
   - Update branding and logos
   - Modify room categories

2. **Add more rooms**:
   - Use Supabase Table Editor
   - Or create an admin panel

3. **Enhance features**:
   - Add image uploads for rooms
   - Implement email notifications
   - Create recurring bookings

4. **Monitor usage**:
   - Check Supabase dashboard for database stats
   - View Vercel analytics

## 🎉 Success!

You now have a fully functional campus resource booking system! 

If you encounter any issues not covered here, please:
- Check the main README.md
- Review Supabase logs
- Check browser console for errors
- Open an issue on GitHub

Happy booking! 📅🎓
