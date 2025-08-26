#!/bin/bash

# WON MUSICALS Deployment Script
echo "🎵 Deploying WON MUSICALS PWA to Vercel..."

# Install Vercel CLI if not already installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Login to Vercel (if not already logged in)
echo "🔐 Checking Vercel authentication..."
vercel whoami || vercel login

# Set environment variables
echo "⚙️ Setting up environment variables..."

# Production environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add ELEVENLABS_API_KEY production
vercel env add VOICE_ID production

# Preview environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL preview
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview
vercel env add ELEVENLABS_API_KEY preview
vercel env add VOICE_ID preview

# Development environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL development
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY development
vercel env add ELEVENLABS_API_KEY development
vercel env add VOICE_ID development

# Deploy to production
echo "🚀 Deploying to production..."
vercel --prod

echo "✅ Deployment complete!"
echo "🌐 Your WON MUSICALS PWA is now live!"
