import { validateEnvironment } from './env-check'

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY
const VOICE_ID = process.env.VOICE_ID || "Gel73m5KFzJvCPmSg285"

export async function generateVoice(text: string): Promise<Blob> {
  // Validate environment variables
  const envCheck = validateEnvironment()
  if (!envCheck.valid) {
    throw new Error(`Missing environment variables: ${envCheck.missing.join(', ')}`)
  }

  if (!ELEVENLABS_API_KEY) {
    throw new Error('ElevenLabs API key not configured')
  }

  console.log('🎤 [Voice]: Starting generation...')
  console.log('📊 [Voice]: Text length:', text.length, 'characters')
  console.log('📊 [Voice]: Using Voice ID:', VOICE_ID)
  console.log('📊 [Voice]: API Key:', ELEVENLABS_API_KEY.substring(0, 10) + '...')
  
  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      }),
    })

    console.log('📊 [Voice]: API Response Status:', response.status)
    console.log('📊 [Voice]: API Response Headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ [Voice]: Generation failed')
      console.error('📊 [Voice]: Error Status:', response.status)
      console.error('📊 [Voice]: Error Response:', errorText)
      
      // Parse error for better user feedback
      let errorMessage = `Voice generation failed: ${response.status}`
      try {
        const errorData = JSON.parse(errorText)
        if (errorData.detail && errorData.detail.message) {
          errorMessage = errorData.detail.message
        }
      } catch (e) {
        errorMessage = errorText || errorMessage
      }
      
      throw new Error(errorMessage)
    }

    const audioBlob = await response.blob()
    console.log('✅ [Voice]: Generation successful')
    console.log('📊 [Voice]: Audio size:', audioBlob.size, 'bytes')
    console.log('📊 [Voice]: Audio type:', audioBlob.type)
    
    return audioBlob
  } catch (error: any) {
    console.error('❌ [Voice]: Generation error:', error)
    throw error
  }
}

// Test ElevenLabs API connection
export async function testElevenLabsAPI() {
  try {
    console.log('🧪 [Voice]: Testing ElevenLabs API...')
    
    if (!ELEVENLABS_API_KEY) {
      throw new Error('ElevenLabs API key not found')
    }

    // Test API key validity with voices endpoint
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API test failed: ${response.status} ${errorText}`)
    }

    const data = await response.json()
    console.log('✅ [Voice]: ElevenLabs API connection successful')
    console.log('📊 [Voice]: Available voices:', data.voices?.length || 0)
    
    return { success: true, voiceCount: data.voices?.length || 0 }
  } catch (error: any) {
    console.error('❌ [Voice]: API test failed:', error)
    return { success: false, error: error.message }
  }
}
