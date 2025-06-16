# 🔐 Secure Supabase Environment Setup

## 📋 Step 1: Update Your .env.local File

Add these lines to your existing `.env.local` file (keep your existing ANTHROPIC_API_KEY):

```env
# ===========================================
# SUPABASE CONFIGURATION
# ===========================================
# Get these values from your Supabase Dashboard > Settings > API

# Supabase Project URL (Public)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here

# Supabase Anonymous Key (Public - safe for client-side)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Supabase Service Role Key (PRIVATE - server-side only)
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

## 🔍 Where to Find Your Supabase Keys

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** > **API**
4. You'll find:
   - **Project URL**: Copy this to `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key**: Copy this to `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key**: Copy this to `SUPABASE_SERVICE_ROLE_KEY`

## 🛡️ Security Notes

- **NEXT_PUBLIC_*** variables are safe for client-side use
- **SUPABASE_SERVICE_ROLE_KEY** is private - only for server-side API routes
- Never commit `.env.local` to version control (it's already in .gitignore)

## 🚀 For Vercel Deployment

Add these same variables in:
**Vercel Dashboard** > **Your Project** > **Settings** > **Environment Variables**

Set them for all environments: Production, Preview, Development 