# IDARAH WALI UL ASER Islamic Library - Deployment Guide

## 🚀 Netlify Deployment

### Prerequisites
1. Supabase project set up with the required database schema
2. GitHub repository with the latest code
3. Netlify account

### Deployment Steps

#### 1. Connect to Netlify
1. Go to [Netlify](https://netlify.com) and sign in
2. Click "New site from Git"
3. Choose GitHub and authorize Netlify
4. Select the `islamic-website` repository

#### 2. Build Settings
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: `18`

#### 3. Environment Variables
Environment variables are now configured in netlify.toml:

```
VITE_SUPABASE_URL=https://bxyzvaujvhumupwdmysh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4eXp2YXVqdmh1bXVwd2RteXNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MTI3OTgsImV4cCI6MjA2ODI4ODc5OH0.qSJ3Dqr-jza_mEJu0byxChZO8AVTHV3yUrW8zbrjOO4
```

**Note**: No manual configuration needed in Netlify dashboard - variables are automatically loaded from netlify.toml

#### 4. Deploy
Click "Deploy site" - Netlify will automatically build and deploy your site.

### 🔧 Supabase Setup Required

Before deployment, ensure your Supabase project has:

1. **Authentication enabled** with email/password
2. **Database tables** for:
   - `profiles` (Islamic user profiles)
   - `books` (Islamic library books)
   - `categories` (Islamic book categories)
   - `borrowing_records` (book borrowing system)
   - `users` (user management)

3. **Row Level Security (RLS)** policies configured
4. **Storage buckets** for book covers and user avatars

### 📱 Features Deployed

- ✅ Complete Islamic library management system
- ✅ Student/Teacher/Admin dashboards
- ✅ Book borrowing and return system
- ✅ Islamic categories (Fiqh, Hadith, Tafseer, etc.)
- ✅ Authentic Islamic design and terminology
- ✅ Mobile-responsive design
- ✅ Supabase authentication and database integration

### 🌐 Live Site
Once deployed, your site will be available at: `https://your-site-name.netlify.app`

### 🔄 Automatic Deployments
Any push to the `main` branch will automatically trigger a new deployment.
