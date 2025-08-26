# 🚀 WON MUSICALS - Vercel Deployment Guide

## Quick Deploy (Recommended)

### 1. One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/won-musicals)

### 2. Manual Deployment Steps

#### Step 1: Install Vercel CLI
\`\`\`bash
npm install -g vercel
\`\`\`

#### Step 2: Login to Vercel
\`\`\`bash
vercel login
\`\`\`

#### Step 3: Deploy from Project Directory
\`\`\`bash
# Navigate to your project
cd won-musicals

# Deploy to preview first
vercel

# Deploy to production
vercel --prod
\`\`\`

## Environment Variables Setup

### Required Variables:

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Value: `https://revelations4family.supabase.co` (your existing project)
   - Environment: Production, Preview, Development

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Value: Your Supabase anon key from revelations4family project
   - Environment: Production, Preview, Development

3. **ELEVENLABS_API_KEY**
   - Value: `sk_8e502f5374e3c90010897ba57858e75138bbd97bd66e4682`
   - Environment: Production, Preview, Development

4. **VOICE_ID**
   - Value: `7IxV0gJoChXuUQlBOyjC`
   - Environment: Production, Preview, Development

### Setting Environment Variables via Vercel Dashboard:

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your WON MUSICALS project
3. Go to Settings → Environment Variables
4. Add each variable for all environments (Production, Preview, Development)

### Setting Environment Variables via CLI:

\`\`\`bash
# Set production variables
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add ELEVENLABS_API_KEY production
vercel env add VOICE_ID production

# Set preview variables
vercel env add NEXT_PUBLIC_SUPABASE_URL preview
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview
vercel env add ELEVENLABS_API_KEY preview
vercel env add VOICE_ID preview

# Set development variables
vercel env add NEXT_PUBLIC_SUPABASE_URL development
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY development
vercel env add ELEVENLABS_API_KEY development
vercel env add VOICE_ID development
\`\`\`

## Post-Deployment Checklist

### ✅ Immediate Testing:
1. Visit your deployed URL
2. Test text input and style selection
3. Generate a short gospel track
4. Verify audio playback works
5. Test download functionality

### ✅ PWA Features:
1. Test installation on mobile device
2. Verify offline functionality
3. Check push notification permissions

### ✅ Database Setup:
1. Run Supabase migration for `won_tracks` table
2. Create `won-musicals-audio` storage bucket
3. Verify RLS policies are active

## Troubleshooting

### Common Issues:

1. **"Missing environment variables" error**
   - Solution: Verify all 4 environment variables are set in Vercel dashboard

2. **Audio generation fails**
   - Check ElevenLabs API key is valid
   - Verify Voice ID is correct
   - Check Vercel function logs

3. **Database connection issues**
   - Confirm Supabase URL and anon key are correct
   - Verify `won_tracks` table exists
   - Check RLS policies

4. **PWA not installing**
   - Ensure manifest.json is accessible
   - Check service worker registration
   - Verify HTTPS is enabled (automatic on Vercel)

## Performance Optimization

### Vercel Configuration:
- Function timeout: 30 seconds (for audio generation)
- Edge caching for static assets
- Automatic HTTPS and CDN

### Monitoring:
- Check Vercel Analytics for usage
- Monitor ElevenLabs API usage
- Track Supabase storage usage

## Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain (e.g., `wonmusicals.com`)
3. Configure DNS records as instructed
4. Update PWA manifest with new domain

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review browser console for errors
3. Test API endpoints individually
4. Verify environment variables are set correctly
