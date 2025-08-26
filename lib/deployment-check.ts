// Deployment health check utilities
export interface DeploymentStatus {
  environment: "development" | "preview" | "production"
  supabaseConfigured: boolean
  elevenLabsConfigured: boolean
  voiceIdConfigured: boolean
  allSystemsReady: boolean
}

export function checkDeploymentStatus(): DeploymentStatus {
  const environment =
    process.env.NODE_ENV === "production"
      ? "production"
      : process.env.VERCEL_ENV === "preview"
        ? "preview"
        : "development"

  const supabaseConfigured = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  const elevenLabsConfigured = !!process.env.ELEVENLABS_API_KEY
  const voiceIdConfigured = !!process.env.VOICE_ID

  const allSystemsReady = supabaseConfigured && elevenLabsConfigured && voiceIdConfigured

  return {
    environment,
    supabaseConfigured,
    elevenLabsConfigured,
    voiceIdConfigured,
    allSystemsReady,
  }
}

export function logDeploymentStatus() {
  const status = checkDeploymentStatus()

  console.log("🎵 WON MUSICALS Deployment Status:")
  console.log(`📍 Environment: ${status.environment}`)
  console.log(`🗄️ Supabase: ${status.supabaseConfigured ? "✅" : "❌"}`)
  console.log(`🎤 ElevenLabs: ${status.elevenLabsConfigured ? "✅" : "❌"}`)
  console.log(`🔊 Voice ID: ${status.voiceIdConfigured ? "✅" : "❌"}`)
  console.log(`🚀 All Systems: ${status.allSystemsReady ? "✅ READY" : "❌ NEEDS SETUP"}`)

  return status
}
