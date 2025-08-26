'use server'

/**
 * Server action to safely retrieve the status of ElevenLabs environment variables.
 * This prevents exposing sensitive API keys to the client.
 */
export async function getElevenLabsEnvStatus() {
  const elevenLabsApiKeySet = !!process.env.ELEVENLABS_API_KEY
  const voiceIdSet = !!process.env.VOICE_ID
  const voiceIdValue = process.env.VOICE_ID || "Gel73m5KFzJvCPmSg285" // Provide default for display if not set

  return {
    elevenLabsApiKeySet,
    voiceIdSet,
    voiceIdValue,
  }
}
