// Environment Variables Validation
export function validateEnvironment() {
  const requiredVars = {
    // Supabase Configuration
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    
    // ElevenLabs Configuration
    ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY,
    VOICE_ID: process.env.VOICE_ID,
    
    // Vercel Blob Configuration
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
  }

  const missing = Object.entries(requiredVars)
    .filter(([key, value]) => !value)
    .map(([key]) => key)

  if (missing.length > 0) {
    console.error('❌ Missing environment variables:', missing)
    return { valid: false, missing }
  }

  console.log('✅ All environment variables are configured')
  return { valid: true, missing: [] }
}

export function logEnvironmentStatus() {
  console.log('🔍 Environment Variables Status:')
  console.log('- Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing')
  console.log('- Supabase Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing')
  console.log('- ElevenLabs API Key:', process.env.ELEVENLABS_API_KEY ? '✅ Set' : '❌ Missing')
  console.log('- Voice ID:', process.env.VOICE_ID ? '✅ Set' : '❌ Missing')
  console.log('- Blob Token:', process.env.BLOB_READ_WRITE_TOKEN ? '✅ Set' : '❌ Missing')
}
