# 🎓 Campus Resource Optimizer

A modern, full-stack web application for managing and booking campus resources (classrooms, labs, and studios) with real-time availability tracking, automated booking completion, and comprehensive user management.

![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?logo=tailwind-css)

## ✨ Features

### 🔐 Authentication & User Management
- Secure email/password authentication via Supabase Auth
- Automatic profile creation on signup
- Protected routes with middleware
- Session management with automatic refresh

### 📅 Room Booking System
- **Browse Rooms**: Grid view of all available campus resources
- **Category Filtering**: Filter by Classrooms, Labs, or Studios
- **Real-time Availability**: See which rooms are available or booked
- **Smart Booking Modal**: 
  - Date and time selection with validation
  - Conflict detection and prevention
  - Visual timeline of existing bookings
  - Purpose/description field
- **Overlap Prevention**: Database-level exclusion constraints prevent double bookings

### 📋 My Bookings Dashboard
- View all bookings with tabs: All, Active, Completed, Cancelled
- Cancel active bookings (for future bookings only)
- Auto-refresh every 30 seconds
- Detailed booking information with room details

### ⚡ Automated Features
- **Auto-completion**: Vercel Cron Job runs every 15 minutes to mark past bookings as completed
- **Real-time Updates**: Booking status updates automatically
- **Smart Validation**: Prevent past bookings and time conflicts

### 🎨 Modern UI/UX
- Beautiful gradient placeholders for rooms without images
- Skeleton loaders for smooth loading states
- Toast notifications for user feedback
- Fully responsive design (mobile-first)
- Accessible with ARIA labels and keyboard navigation
- Smooth animations and transitions

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16.2 (App Router)
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 4.0
- **UI Components**: Custom components with Radix UI primitives
- **Icons**: Lucide React
- **State Management**: React hooks + custom hooks

### Backend
- **API**: Next.js API Routes
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (ready for image uploads)
- **ORM**: Supabase Client SDK

### Deployment
- **Platform**: Vercel (optimized)
- **Cron Jobs**: Vercel Cron (auto-completion)
- **Environment**: Serverless functions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- A Supabase account and project
- (Optional) Vercel account for deployment

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd swiftspace
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the entire `supabase-schema.sql` file
3. Verify tables are created in **Table Editor**
4. Get your credentials from **Settings → API**

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Cron Job Security (generate a random string)
CRON_SECRET=your_random_secret_for_cron_here

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Create Your First Account

1. Navigate to `/signup`
2. Create an account with email/password
3. You'll be automatically logged in and redirected to the dashboard

## 📊 Database Schema

The complete schema is in `supabase-schema.sql`. Key tables:

- **`profiles`**: User information (extends Supabase auth.users)
- **`rooms`**: Campus resources with categories, capacity, amenities
- **`bookings`**: User bookings with automatic conflict prevention

Features:
- Row Level Security (RLS) on all tables
- Automatic timestamps
- Exclusion constraints for overlap prevention
- Auto-completion function for past bookings
- Optimized indexes

## 🔄 Auto-Completion System

Vercel Cron Job calls `/api/auto-complete` every 15 minutes to automatically mark past bookings as completed. Protected with `CRON_SECRET` for security.

## 📱 Responsive Design

Mobile-first approach with breakpoints at 640px, 768px, and 1024px. Touch-friendly UI optimized for all screen sizes.

## 🚢 Deployment to Vercel

1. Push to GitHub
2. Import repository in Vercel dashboard
3. Add environment variables
4. Deploy!

Vercel auto-detects Next.js and configures cron jobs from `vercel.json`.

## 🧪 Testing Checklist

- [ ] Sign up and log in
- [ ] Browse and filter rooms
- [ ] Create bookings
- [ ] Test overlap prevention
- [ ] Cancel bookings
- [ ] Verify auto-completion

## 📝 API Routes

- `GET /api/rooms` - List rooms with optional filtering
- `GET /api/bookings` - User's bookings
- `POST /api/bookings` - Create booking
- `PATCH /api/bookings/:id` - Cancel booking
- `POST /api/auto-complete` - Cron endpoint

## 🎯 Future Enhancements

- Image upload for rooms
- Email notifications
- Recurring bookings
- Admin dashboard
- Analytics and reporting
- Calendar view
- Export to iCal

## 🐛 Troubleshooting

**Unauthorized errors**: Check Supabase credentials and RLS policies

**Auto-completion not working**: Verify `CRON_SECRET` in Vercel environment

**Overlapping bookings**: Ensure EXCLUDE constraint and `btree_gist` extension exist

## 📄 License

MIT License - Open source and free to use!

---

**Built with ❤️ using Next.js, TypeScript, and Supabase**
