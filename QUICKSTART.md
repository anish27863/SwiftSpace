# ⚡ Quick Start - Campus Resource Optimizer

Get up and running in under 10 minutes!

## 🚀 TL;DR

```bash
# 1. Install dependencies
npm install

# 2. Set up Supabase (visit supabase.com, create project, run supabase-schema.sql)

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# 4. Run development server
npm run dev

# 5. Open http://localhost:3000 and sign up!
```

## 📋 Prerequisites Checklist

- [ ] Node.js 18+ installed (`node --version`)
- [ ] Supabase account created
- [ ] Code editor ready (VS Code recommended)

## 🎯 Essential Steps

### 1. Supabase Setup (5 min)

1. Go to [supabase.com](https://supabase.com) → New Project
2. Name it, choose password, create
3. SQL Editor → New Query
4. Copy ALL of `supabase-schema.sql` → Run
5. Settings → API → Copy URL and keys

### 2. Environment Variables (2 min)

Edit `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
CRON_SECRET=make-this-a-long-random-string
```

### 3. Run & Test (3 min)

```bash
npm run dev
```

Visit http://localhost:3000:
1. Click "Sign up"
2. Create account
3. You're in! Browse the 12 sample rooms
4. Book one to test

## 🎉 You're Done!

The app is now running locally with:
- ✅ Authentication working
- ✅ 12 sample rooms
- ✅ Booking system active
- ✅ Database connected

## 🚀 Deploy to Vercel (Optional, 5 min)

```bash
# Push to GitHub
git init
git add .
git commit -m "Initial commit"
git push

# Then:
# 1. Visit vercel.com
# 2. Import repository
# 3. Add environment variables
# 4. Deploy!
```

## 🐛 Quick Troubleshooting

**Can't see rooms?**
- Check Supabase Table Editor → rooms (should have 12 rows)

**Authentication error?**
- Verify `.env.local` credentials match Supabase dashboard

**Port 3000 in use?**
```bash
npm run dev -- -p 3001
```

## 📚 Full Documentation

- `README.md` - Complete feature documentation
- `SETUP_GUIDE.md` - Detailed setup instructions
- `PROJECT_SUMMARY.md` - What's included
- `supabase-schema.sql` - Database documentation

## 🎯 Common Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Run production build
npm run lint         # Run linter
```

## 📞 Need Help?

1. Check browser console for errors
2. Check Supabase logs
3. Review SETUP_GUIDE.md
4. Check all environment variables are set

## ✨ Features to Try

1. **Browse Rooms**: Filter by category (Classrooms, Labs, Studios)
2. **Book a Room**: Click "Book Now", select date/time
3. **View Bookings**: Go to /bookings, see your bookings
4. **Test Conflicts**: Try booking same room/time (should fail)
5. **Cancel Booking**: Click cancel on active booking

---

**Built with**: Next.js 16 • TypeScript • Supabase • Tailwind CSS 4

**Ready in**: ~10 minutes ⏱️

**Questions?** See README.md or SETUP_GUIDE.md
