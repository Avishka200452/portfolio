# Portfolio — Next.js + Supabase

A bespoke visual designer & content creator portfolio website featuring 3D animated galleries, custom cursor physics, and an interactive admin CMS, built with **Next.js**, **Supabase**, **GSAP**, and **Tailwind CSS**.

---

## 🚀 Quick Setup (5 steps)

### Step 1 — Set up Supabase

1. Go to [supabase.com](https://supabase.com) → create a new project
2. Go to **SQL Editor** → New Query → paste the entire contents of `supabase/schema.sql` → Run
3. Go to **Settings → API** → copy your **Project URL** and **anon key**

### Step 2 — Add your keys

Open `.env.local` and replace the placeholders:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
```

### Step 3 — Create your admin account

1. In Supabase → **Authentication → Users → Add User**
2. Enter your email and password → Create
3. This is how you'll log into `/admin`

### Step 4 — Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 to see your portfolio.
Open http://localhost:3000/admin to manage content.

### Step 5 — Deploy to Vercel

1. Push to GitHub:
```bash
git init && git add . && git commit -m "Initial portfolio"
git remote add origin https://github.com/YOUR_USERNAME/portfolio-v2.git
git push -u origin main
```
2. Go to vercel.com → Import repo → Add the 2 env variables → Deploy

---

## Customizing

All design tokens are in `app/globals.css`:
- Change `--accent: #FF5C00` to any color to retheme the whole site
- Change `--bg: #0a0a0f` to change the background

Edit typewriter words in `components/sections/Hero.js` → `const WORDS = [...]`

## Admin Panel

- `/admin` — Secure authentication and content management
- Manage Profile & CV, Videos, Still Frames / Photography, Social Campaigns, Branding, Logo Design, and UI/UX projects directly in real-time.