# 🚀 WON MUSICALS - Vercel Environment Setup

## Your Exact Environment Variables

Copy and paste these **exact values** into your Vercel project:

### 📍 **Vercel Dashboard Setup**
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your **WON MUSICALS** project
3. Navigate to **Settings** → **Environment Variables**
4. Add these **4 variables** for **ALL environments** (Production, Preview, Development):

---

### 🗄️ **Supabase Configuration**

**Variable Name:** `NEXT_PUBLIC_SUPABASE_URL`
**Value:** 
\`\`\`
https://wghbslcvqpizptsdkvnm.supabase.co
\`\`\`

**Variable Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
**Value:** 
\`\`\`
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndnaGJzbGN2cXBpenB0c2Rrdm5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3NzE2NTQsImV4cCI6MjA3MTM0NzY1NH0.tMIoyzBrBe_DwBAWjDOwTVpwhccge2QoxzeAjxWxno8
\`\`\`

---

### 🎤 **ElevenLabs Configuration**

**Variable Name:** `ELEVENLABS_API_KEY`
**Value:** 
\`\`\`
sk_8e502f5374e3c90010897ba57858e75138bbd97bd66e4682
\`\`\`

**Variable Name:** `VOICE_ID`
**Value:** 
\`\`\`
7IxV0gJoChXuUQlBOyjC
\`\`\`

---

## 🔧 **Quick Setup via CLI**

If you prefer using the command line:

\`\`\`bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Navigate to your project directory
cd won-musicals

# Add environment variables (paste each value when prompted)
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add ELEVENLABS_API_KEY production
vercel env add VOICE_ID production

# Repeat for preview and development environments
vercel env add NEXT_PUBLIC_SUPABASE_URL preview
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview
vercel env add ELEVENLABS_API_KEY preview
vercel env add VOICE_ID preview

vercel env add NEXT_PUBLIC_SUPABASE_URL development
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY development
vercel env add ELEVENLABS_API_KEY development
vercel env add VOICE_ID development

# Deploy to production
vercel --prod
\`\`\`

---

## ✅ **Verification Steps**

After adding the environment variables:

1. **Redeploy your project** (Vercel will automatically redeploy)
2. **Visit your live URL**
3. **Test the connection** by generating a gospel track
4. **Check the browser console** for any connection errors

---

## 🗄️ **Database Setup Required**

Don't forget to run this SQL in your Supabase SQL editor:

\`\`\`sql
-- Create WON MUSICALS table
CREATE TABLE IF NOT EXISTS won_tracks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt TEXT NOT NULL,
  style VARCHAR(50) NOT NULL,
  language VARCHAR(20) NOT NULL DEFAULT 'english',
  audio_url TEXT,
  duration INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('won-musicals-audio', 'won-musicals-audio', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE won_tracks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view tracks" ON won_tracks FOR SELECT USING (true);
CREATE POLICY "Anyone can insert tracks" ON won_tracks FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view audio files" ON storage.objects FOR SELECT USING (bucket_id = 'won-musicals-audio');
CREATE POLICY "Anyone can upload audio" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'won-musicals-audio');
\`\`\`

---

## 🎯 **Expected Result**

After setup, your WON MUSICALS PWA will:
- ✅ Connect to your existing Supabase project
- ✅ Generate gospel audio with your custom voice
- ✅ Store tracks in the database
- ✅ Work across all devices as a PWA

Your app will be live at: `https://your-project-name.vercel.app`
