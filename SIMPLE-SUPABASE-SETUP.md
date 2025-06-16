# 🚀 Super Simple Supabase Setup Guide

Let's do this step by step! No rush, we'll go through each part together.

## Step 1: Do You Have a Supabase Project? 🤔

**First, let's check - do you already have a Supabase project created?**

### If YES - you have a Supabase project:
- Go to https://supabase.com/dashboard
- You should see your project listed
- ✅ **Skip to Step 2**

### If NO - you need to create one:
1. Go to https://supabase.com
2. Click **"Start your project"** or **"New Project"**
3. Sign in with GitHub/Google (whatever you prefer)
4. Click **"New Project"**
5. Choose:
   - **Organization**: Use your personal org
   - **Name**: `ai-companion` (or whatever you like)
   - **Database Password**: Create a strong password (save it somewhere!)
   - **Region**: Choose closest to you
6. Click **"Create new project"**
7. ⏳ Wait 2-3 minutes for it to set up

---

## Step 2: Get Your API Keys 🔑

Once your project is ready:

1. **Make sure you're in your project dashboard**
2. Look for **"Settings"** in the left sidebar (usually at the bottom)
3. Click **Settings** → **API**
4. You'll see a page with several keys

### What you need to copy:
- **Project URL** (looks like: `https://abcdefgh.supabase.co`)
- **anon public** key (starts with `eyJ...`)
- **service_role** key (starts with `eyJ...` but is different/longer)

**📝 IMPORTANT: Don't close this page yet! Keep it open - we'll need these in the next step.**

---

## Step 3: Add Keys to Your App 🔧

Now we'll add these keys to your app:

1. **Open VS Code** (or whatever editor you use)
2. **Navigate to your project**: `/Users/michaelchristine/ai-companion/frontend/`
3. **Find the file**: `.env.local` (it should already exist)
4. **Open `.env.local`** - you should see your Anthropic key already there
5. **Add these new lines at the bottom**:

```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=PASTE_YOUR_PROJECT_URL_HERE
NEXT_PUBLIC_SUPABASE_ANON_KEY=PASTE_YOUR_ANON_KEY_HERE
SUPABASE_SERVICE_ROLE_KEY=PASTE_YOUR_SERVICE_ROLE_KEY_HERE
```

6. **Replace the placeholder text** with your actual keys from Step 2
7. **Save the file**

### Example of what it should look like:
```
ANTHROPIC_API_KEY=sk-ant-api03-your-existing-key...

# Supabase Configuration  
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Step 4: Set Up Database Tables 🗄️

This is the last step! We need to create tables in your database:

1. **Go back to your Supabase dashboard**
2. **Click "SQL Editor"** in the left sidebar
3. **Click "New Query"**
4. **Open the file** `database-schema.sql` from your project
5. **Copy ALL the text** from that file
6. **Paste it** into the SQL Editor
7. **Click "RUN"** (big button at the bottom right)
8. ✅ You should see "Success. No rows returned" - that's good!

---

## 🎉 That's It! You're Done!

Your app now has:
- ✅ Supabase connected
- ✅ Database tables created  
- ✅ Secure authentication ready
- ✅ Ready to save characters and conversations!

---

## 🆘 Need Help?

**If you get stuck on any step**, just tell me:
1. **Which step** you're on (1, 2, 3, or 4)
2. **What you see** vs what you expected
3. **Any error messages**

I'll help you through it! 😊 