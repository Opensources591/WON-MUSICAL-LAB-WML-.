#!/bin/bash

echo "🎵 Setting up WON MUSICALS Environment Variables"
echo "================================================"

# Your Supabase credentials
SUPABASE_URL="https://wghbslcvqpizptsdkvnm.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndnaGJzbGN2cXBpenB0c2Rrdm5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3NzE2NTQsImV4cCI6MjA3MTM0NzY1NH0.tMIoyzBrBe_DwBAWjDOwTVpwhccge2QoxzeAjxWxno8"

# ElevenLabs credentials
ELEVENLABS_API_KEY="sk_8e502f5374e3c90010897ba57858e75138bbd97bd66e4682"
VOICE_ID="7IxV0gJoChXuUQlBOyjC"

echo "🔧 Adding environment variables to Vercel..."

# Production Environment
echo "📦 Setting PRODUCTION environment variables..."
echo $SUPABASE_URL | vercel env add NEXT_PUBLIC_SUPABASE_URL production
echo $SUPABASE_ANON_KEY | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
echo $ELEVENLABS_API_KEY | vercel env add ELEVENLABS_API_KEY production
echo $VOICE_ID | vercel env add VOICE_ID production

# Preview Environment
echo "🔍 Setting PREVIEW environment variables..."
echo $SUPABASE_URL | vercel env add NEXT_PUBLIC_SUPABASE_URL preview
echo $SUPABASE_ANON_KEY | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview
echo $ELEVENLABS_API_KEY | vercel env add ELEVENLABS_API_KEY preview
echo $VOICE_ID | vercel env add VOICE_ID preview

# Development Environment
echo "🛠️ Setting DEVELOPMENT environment variables..."
echo $SUPABASE_URL | vercel env add NEXT_PUBLIC_SUPABASE_URL development
echo $SUPABASE_ANON_KEY | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY development
echo $ELEVENLABS_API_KEY | vercel env add ELEVENLABS_API_KEY development
echo $VOICE_ID | vercel env add VOICE_ID development

echo "✅ All environment variables configured!"
echo "🚀 Ready to deploy WON MUSICALS!"
