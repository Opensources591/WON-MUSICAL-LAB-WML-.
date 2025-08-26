// ElevenLabs API configuration
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || "sk_8e502f5374e3c90010897ba57858e75138bbd97bd66e4682"
const VOICE_ID = process.env.VOICE_ID || "7IxV0gJoChXuUQlBOyjC"

export interface VoiceGenerationRequest {
  text: string
  voice_settings?: {
    stability: number
    similarity_boost: number
    style: number
    use_speaker_boost: boolean
  }
}

export async function generateVoiceAudio(text: string): Promise<Blob> {
  console.log("🎵 [ElevenLabs]: Generating audio for WON MUSICALS")
  console.log("📝 [ElevenLabs]: Text length:", text.length)
  console.log("🎤 [ElevenLabs]: Voice ID:", VOICE_ID)

  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: "POST",
    headers: {
      Accept: "audio/mpeg",
      "Content-Type": "application/json",
      "xi-api-key": ELEVENLABS_API_KEY,
    },
    body: JSON.stringify({
      text,
      model_id: "eleven_multilingual_v2",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.8,
        style: 0.2,
        use_speaker_boost: true,
      },
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("❌ [ElevenLabs]: Generation failed:", errorText)
    throw new Error(`Voice generation failed: ${response.status} ${errorText}`)
  }

  const audioBlob = await response.blob()
  console.log("✅ [ElevenLabs]: Audio generated successfully")
  console.log("📊 [ElevenLabs]: Audio size:", audioBlob.size, "bytes")

  return audioBlob
}

// Test the custom voice
export async function testCustomVoice() {
  try {
    const testText = "Hallelujah! This is WON MUSICALS testing the custom gospel voice."
    const audioBlob = await generateVoiceAudio(testText)
    return { success: true, audioSize: audioBlob.size }
  } catch (error: any) {
    console.error("❌ [Voice Test]: Failed:", error)
    return { success: false, error: error.message }
  }
}
