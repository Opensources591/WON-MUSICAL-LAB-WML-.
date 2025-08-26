import { supabase } from './supabase'
import { generateVoice } from './voice'

// Test Supabase Connection
export async function testSupabaseConnection() {
  try {
    console.log('🧪 Testing Supabase connection...')
    const { data, error } = await supabase.from('_realtime_schema').select('*').limit(1)
    
    if (error && error.code !== 'PGRST116') {
      console.error('❌ Supabase connection failed:', error)
      return { success: false, error: error.message }
    }
    
    console.log('✅ Supabase connection successful')
    return { success: true }
  } catch (error: any) {
    console.error('❌ Supabase connection error:', error)
    return { success: false, error: error.message }
  }
}

// Test ElevenLabs API Connection
export async function testElevenLabsConnection() {
  try {
    console.log('🧪 Testing ElevenLabs API connection...')
    
    if (!process.env.ELEVENLABS_API_KEY) {
      throw new Error('ElevenLabs API key not found')
    }

    // Test with a short text to avoid using too many credits
    const testText = "Hello, this is a test."
    const audioBlob = await generateVoice(testText)
    
    if (audioBlob && audioBlob.size > 0) {
      console.log('✅ ElevenLabs API connection successful')
      console.log(`📊 Generated audio size: ${audioBlob.size} bytes`)
      return { success: true, audioSize: audioBlob.size }
    } else {
      throw new Error('Generated audio is empty')
    }
  } catch (error: any) {
    console.error('❌ ElevenLabs API connection failed:', error)
    return { success: false, error: error.message }
  }
}

// Test Vercel Blob Connection
export async function testVercelBlobConnection() {
  try {
    console.log('🧪 Testing Vercel Blob connection...')
    
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      throw new Error('Vercel Blob token not found')
    }

    // Import put function dynamically to avoid build issues
    const { put } = await import('@vercel/blob')
    
    // Create a small test file
    const testContent = new Blob(['RevNet Labs API Test'], { type: 'text/plain' })
    const testFilename = `test-${Date.now()}.txt`
    
    const result = await put(testFilename, testContent, {
      access: 'public',
      contentType: 'text/plain',
    })
    
    if (result.url) {
      console.log('✅ Vercel Blob connection successful')
      console.log(`📊 Test file URL: ${result.url}`)
      return { success: true, testUrl: result.url }
    } else {
      throw new Error('Failed to upload test file')
    }
  } catch (error: any) {
    console.error('❌ Vercel Blob connection failed:', error)
    return { success: false, error: error.message }
  }
}

// Run all API tests
export async function runAllAPITests() {
  console.log('🚀 Running comprehensive API tests...')
  
  const results = {
    supabase: await testSupabaseConnection(),
    elevenlabs: await testElevenLabsConnection(),
    vercelBlob: await testVercelBlobConnection(),
  }
  
  const allSuccessful = Object.values(results).every(result => result.success)
  
  console.log('📋 API Test Results:')
  console.log('- Supabase:', results.supabase.success ? '✅ Connected' : '❌ Failed')
  console.log('- ElevenLabs:', results.elevenlabs.success ? '✅ Connected' : '❌ Failed')
  console.log('- Vercel Blob:', results.vercelBlob.success ? '✅ Connected' : '❌ Failed')
  
  if (allSuccessful) {
    console.log('🎉 All APIs are connected and working!')
  } else {
    console.log('⚠️ Some APIs have connection issues')
  }
  
  return { allSuccessful, results }
}
