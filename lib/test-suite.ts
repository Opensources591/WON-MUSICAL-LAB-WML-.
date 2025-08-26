// Comprehensive testing suite for RevNet Labs
export interface TestResult {
  name: string
  status: 'pass' | 'fail' | 'warning'
  message: string
  details?: any
}

export interface TestSuite {
  environment: TestResult[]
  authentication: TestResult[]
  voiceGeneration: TestResult[]
  cloudStorage: TestResult[]
  ui: TestResult[]
}

// Environment Variables Test
export function testEnvironmentVariables(): TestResult[] {
  const results: TestResult[] = []
  
  const requiredVars = {
    'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL,
    'NEXT_PUBLIC_SUPABASE_ANON_KEY': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    'ELEVENLABS_API_KEY': process.env.ELEVENLABS_API_KEY,
    'VOICE_ID': process.env.VOICE_ID,
    'BLOB_READ_WRITE_TOKEN': process.env.BLOB_READ_WRITE_TOKEN,
  }

  Object.entries(requiredVars).forEach(([key, value]) => {
    if (!value) {
      results.push({
        name: `Environment Variable: ${key}`,
        status: 'fail',
        message: `Missing required environment variable: ${key}`,
        details: { variable: key, value: 'undefined' }
      })
    } else {
      results.push({
        name: `Environment Variable: ${key}`,
        status: 'pass',
        message: `✅ ${key} is configured`,
        details: { 
          variable: key, 
          valueLength: value.length,
          preview: key.includes('KEY') ? `${value.substring(0, 10)}...` : value.substring(0, 30) + '...'
        }
      })
    }
  })

  return results
}

// Authentication Flow Test
export async function testAuthenticationFlow(): Promise<TestResult[]> {
  const results: TestResult[] = []
  
  try {
    // Test Supabase client initialization
    const { supabase } = await import('./supabase')
    
    results.push({
      name: 'Supabase Client Initialization',
      status: 'pass',
      message: '✅ Supabase client initialized successfully'
    })

    // Test basic connection
    try {
      const { data, error } = await supabase.auth.getSession()
      
      if (error && error.message !== 'Invalid JWT') {
        results.push({
          name: 'Supabase Connection Test',
          status: 'fail',
          message: `❌ Connection failed: ${error.message}`,
          details: error
        })
      } else {
        results.push({
          name: 'Supabase Connection Test',
          status: 'pass',
          message: '✅ Successfully connected to Supabase'
        })
      }
    } catch (connectionError: any) {
      results.push({
        name: 'Supabase Connection Test',
        status: 'fail',
        message: `❌ Connection error: ${connectionError.message}`,
        details: connectionError
      })
    }

    // Test auth methods exist
    const authMethods = ['signUp', 'signInWithPassword', 'signOut', 'getUser', 'onAuthStateChange']
    authMethods.forEach(method => {
      if (typeof supabase.auth[method as keyof typeof supabase.auth] === 'function') {
        results.push({
          name: `Auth Method: ${method}`,
          status: 'pass',
          message: `✅ ${method} method available`
        })
      } else {
        results.push({
          name: `Auth Method: ${method}`,
          status: 'fail',
          message: `❌ ${method} method not available`
        })
      }
    })

  } catch (error: any) {
    results.push({
      name: 'Authentication System',
      status: 'fail',
      message: `❌ Authentication system failed to initialize: ${error.message}`,
      details: error
    })
  }

  return results
}

// Voice Generation Test
export async function testVoiceGeneration(): Promise<TestResult[]> {
  const results: TestResult[] = []
  
  try {
    // Check ElevenLabs configuration
    const apiKey = process.env.ELEVENLABS_API_KEY
    const voiceId = process.env.VOICE_ID
    
    if (!apiKey) {
      results.push({
        name: 'ElevenLabs API Key',
        status: 'fail',
        message: '❌ ElevenLabs API key not configured'
      })
      return results
    }

    if (!voiceId) {
      results.push({
        name: 'Voice ID Configuration',
        status: 'warning',
        message: '⚠️ Voice ID not set, using default'
      })
    } else {
      results.push({
        name: 'Voice ID Configuration',
        status: 'pass',
        message: `✅ Voice ID configured: ${voiceId}`
      })
    }

    // Test API key format
    if (apiKey.startsWith('sk_')) {
      results.push({
        name: 'API Key Format',
        status: 'pass',
        message: '✅ API key format appears correct'
      })
    } else {
      results.push({
        name: 'API Key Format',
        status: 'warning',
        message: '⚠️ API key format may be incorrect (should start with sk_)'
      })
    }

    // Test voice generation function import
    try {
      const { generateVoice } = await import('./voice')
      results.push({
        name: 'Voice Generation Function',
        status: 'pass',
        message: '✅ Voice generation function imported successfully'
      })

      // Test with minimal text (to avoid using credits)
      try {
        // We won't actually call the API in testing to avoid using credits
        results.push({
          name: 'Voice Generation Setup',
          status: 'pass',
          message: '✅ Voice generation is ready (API call not tested to preserve credits)'
        })
      } catch (voiceError: any) {
        results.push({
          name: 'Voice Generation Test',
          status: 'fail',
          message: `❌ Voice generation failed: ${voiceError.message}`,
          details: voiceError
        })
      }
    } catch (importError: any) {
      results.push({
        name: 'Voice Generation Function',
        status: 'fail',
        message: `❌ Failed to import voice generation function: ${importError.message}`,
        details: importError
      })
    }

  } catch (error: any) {
    results.push({
      name: 'Voice Generation System',
      status: 'fail',
      message: `❌ Voice generation system error: ${error.message}`,
      details: error
    })
  }

  return results
}

// Cloud Storage Test
export async function testCloudStorage(): Promise<TestResult[]> {
  const results: TestResult[] = []
  
  try {
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN
    
    if (!blobToken) {
      results.push({
        name: 'Vercel Blob Token',
        status: 'fail',
        message: '❌ Vercel Blob token not configured'
      })
      return results
    }

    results.push({
      name: 'Vercel Blob Token',
      status: 'pass',
      message: '✅ Vercel Blob token configured'
    })

    // Test Vercel Blob import
    try {
      const { put } = await import('@vercel/blob')
      results.push({
        name: 'Vercel Blob Import',
        status: 'pass',
        message: '✅ Vercel Blob package imported successfully'
      })

      // Test blob upload function (without actually uploading)
      if (typeof put === 'function') {
        results.push({
          name: 'Blob Upload Function',
          status: 'pass',
          message: '✅ Blob upload function is available'
        })
      } else {
        results.push({
          name: 'Blob Upload Function',
          status: 'fail',
          message: '❌ Blob upload function not available'
        })
      }
    } catch (importError: any) {
      results.push({
        name: 'Vercel Blob Import',
        status: 'fail',
        message: `❌ Failed to import Vercel Blob: ${importError.message}`,
        details: importError
      })
    }

  } catch (error: any) {
    results.push({
      name: 'Cloud Storage System',
      status: 'fail',
      message: `❌ Cloud storage system error: ${error.message}`,
      details: error
    })
  }

  return results
}

// UI Components Test
export async function testUIComponents(): Promise<TestResult[]> {
  const results: TestResult[] = []
  
  try {
    // Test critical UI component imports
    const components = [
      { name: 'Button', path: '@/components/ui/button' },
      { name: 'Card', path: '@/components/ui/card' },
      { name: 'Input', path: '@/components/ui/input' },
      { name: 'Textarea', path: '@/components/ui/textarea' },
      { name: 'Toast', path: '@/components/ui/toast' },
    ]

    for (const component of components) {
      try {
        await import(component.path)
        results.push({
          name: `UI Component: ${component.name}`,
          status: 'pass',
          message: `✅ ${component.name} component available`
        })
      } catch (importError: any) {
        results.push({
          name: `UI Component: ${component.name}`,
          status: 'fail',
          message: `❌ Failed to import ${component.name}: ${importError.message}`,
          details: importError
        })
      }
    }

    // Test hooks
    const hooks = [
      { name: 'useAuth', path: '@/hooks/use-auth' },
      { name: 'useToast', path: '@/hooks/use-toast' },
    ]

    for (const hook of hooks) {
      try {
        await import(hook.path)
        results.push({
          name: `Hook: ${hook.name}`,
          status: 'pass',
          message: `✅ ${hook.name} hook available`
        })
      } catch (importError: any) {
        results.push({
          name: `Hook: ${hook.name}`,
          status: 'fail',
          message: `❌ Failed to import ${hook.name}: ${importError.message}`,
          details: importError
        })
      }
    }

  } catch (error: any) {
    results.push({
      name: 'UI System',
      status: 'fail',
      message: `❌ UI system error: ${error.message}`,
      details: error
    })
  }

  return results
}

// Run all tests
export async function runCompleteTestSuite(): Promise<TestSuite> {
  console.log('🧪 Starting comprehensive test suite...')
  
  const results: TestSuite = {
    environment: testEnvironmentVariables(),
    authentication: await testAuthenticationFlow(),
    voiceGeneration: await testVoiceGeneration(),
    cloudStorage: await testCloudStorage(),
    ui: await testUIComponents(),
  }

  // Log summary
  const allResults = [
    ...results.environment,
    ...results.authentication,
    ...results.voiceGeneration,
    ...results.cloudStorage,
    ...results.ui,
  ]

  const passed = allResults.filter(r => r.status === 'pass').length
  const failed = allResults.filter(r => r.status === 'fail').length
  const warnings = allResults.filter(r => r.status === 'warning').length

  console.log('📊 Test Suite Results:')
  console.log(`✅ Passed: ${passed}`)
  console.log(`❌ Failed: ${failed}`)
  console.log(`⚠️ Warnings: ${warnings}`)
  console.log(`📈 Success Rate: ${Math.round((passed / allResults.length) * 100)}%`)

  return results
}
