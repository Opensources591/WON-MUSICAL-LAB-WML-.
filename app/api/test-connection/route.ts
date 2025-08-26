import { NextResponse } from "next/server"
import { testSupabaseConnection } from "@/lib/supabase"

export async function GET() {
  try {
    console.log("🧪 [API]: Testing WON MUSICALS connections...")

    // Test Supabase connection
    const supabaseTest = await testSupabaseConnection()

    // Test ElevenLabs configuration
    const elevenLabsConfigured = !!process.env.ELEVENLABS_API_KEY
    const voiceIdConfigured = !!process.env.VOICE_ID

    const results = {
      timestamp: new Date().toISOString(),
      supabase: supabaseTest,
      elevenlabs: {
        configured: elevenLabsConfigured,
        apiKey: process.env.ELEVENLABS_API_KEY ? "✅ Set" : "❌ Missing",
        voiceId: process.env.VOICE_ID || "❌ Missing",
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV || "local",
      },
      allSystemsReady: supabaseTest.success && elevenLabsConfigured && voiceIdConfigured,
    }

    console.log("📊 [API]: Connection test results:", results)

    return NextResponse.json(results)
  } catch (error: any) {
    console.error("❌ [API]: Connection test failed:", error)
    return NextResponse.json(
      {
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
