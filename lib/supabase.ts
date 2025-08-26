import { createClient } from "@supabase/supabase-js"

// Your Supabase configuration
const supabaseUrl = "https://wghbslcvqpizptsdkvnm.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndnaGJzbGN2cXBpenB0c2Rrdm5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3NzE2NTQsImV4cCI6MjA3MTM0NzY1NH0.tMIoyzBrBe_DwBAWjDOwTVpwhccge2QoxzeAjxWxno8"

// Use environment variables in production, fallback to hardcoded values for development
const finalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || supabaseUrl
const finalKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || supabaseAnonKey

console.log("🔗 [Supabase]: Connecting to", finalUrl)
console.log("🔑 [Supabase]: Using key", finalKey.substring(0, 20) + "...")

export const supabase = createClient(finalUrl, finalKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// Database types
export interface Track {
  id: string
  prompt: string
  style: string
  language: "english" | "yoruba" | "pidgin"
  audio_url: string
  duration: number
  created_at: string
  user_id?: string
}

// Test connection
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from("won_tracks").select("count", { count: "exact", head: true })

    if (error) {
      console.error("❌ [Supabase]: Connection test failed:", error.message)
      return { success: false, error: error.message }
    }

    console.log("✅ [Supabase]: Connection successful")
    return { success: true, count: data }
  } catch (error: any) {
    console.error("❌ [Supabase]: Connection error:", error.message)
    return { success: false, error: error.message }
  }
}
