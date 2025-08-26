import { type NextRequest, NextResponse } from "next/server"
import { generateVoiceAudio } from "@/lib/elevenlabs"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { prompt, style, language } = await request.json()

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Limit text length for 59-second clips
    if (prompt.length > 500) {
      return NextResponse.json(
        {
          error: "Text too long. Please keep it under 500 characters for optimal audio length.",
        },
        { status: 400 },
      )
    }

    console.log("🎵 [API]: Generating audio for WON MUSICALS")
    console.log("📝 [API]: Prompt:", prompt.substring(0, 100) + "...")
    console.log("🎨 [API]: Style:", style)
    console.log("🌍 [API]: Language:", language)

    // Generate audio with ElevenLabs
    const audioBlob = await generateVoiceAudio(prompt)

    // Convert blob to buffer for storage
    const arrayBuffer = await audioBlob.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Generate unique filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const filename = `won-musicals-${timestamp}.mp3`

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("won-musicals-audio")
      .upload(filename, buffer, {
        contentType: "audio/mpeg",
        cacheControl: "3600",
      })

    if (uploadError) {
      console.error("❌ [Storage]: Upload failed:", uploadError)
      // Return audio blob URL as fallback
      const audioUrl = URL.createObjectURL(audioBlob)
      return NextResponse.json({
        success: true,
        audioUrl,
        message: "Audio generated successfully (temporary URL)",
        duration: Math.min(Math.floor(prompt.length / 8), 59), // Estimate duration
      })
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("won-musicals-audio").getPublicUrl(filename)

    // Save track metadata to database
    const trackData = {
      prompt,
      style,
      language,
      audio_url: publicUrl,
      duration: Math.min(Math.floor(prompt.length / 8), 59), // Estimate duration
    }

    const { data: track, error: dbError } = await supabase.from("won_tracks").insert(trackData).select().single()

    if (dbError) {
      console.error("❌ [Database]: Save failed:", dbError)
    }

    console.log("✅ [API]: Audio generation complete")
    console.log("🔗 [API]: Audio URL:", publicUrl)

    return NextResponse.json({
      success: true,
      audioUrl: publicUrl,
      track: track || trackData,
      message: "Gospel audio generated successfully!",
    })
  } catch (error: any) {
    console.error("❌ [API]: Generation failed:", error)
    return NextResponse.json({ error: error.message || "Failed to generate audio" }, { status: 500 })
  }
}
