import { supabase } from './supabase'

export async function debugSupabaseConnection() {
  console.log('🔍 [Supabase Debug]: Starting connection test...')
  
  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  console.log('📊 [Supabase Debug]: Environment Variables')
  console.log('- URL:', supabaseUrl ? `${supabaseUrl.substring(0, 30)}...` : '❌ MISSING')
  console.log('- Anon Key:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : '❌ MISSING')
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ [Supabase Debug]: Missing environment variables')
    return { success: false, error: 'Missing environment variables' }
  }
  
  try {
    // Test basic connection
    console.log('🧪 [Supabase Debug]: Testing basic connection...')
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('❌ [Supabase Debug]: Session error:', error)
      return { success: false, error: error.message }
    }
    
    console.log('✅ [Supabase Debug]: Basic connection successful')
    
    // Test auth configuration
    console.log('🧪 [Supabase Debug]: Testing auth configuration...')
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError && userError.message !== 'Invalid JWT') {
      console.error('❌ [Supabase Debug]: Auth config error:', userError)
      return { success: false, error: userError.message }
    }
    
    console.log('✅ [Supabase Debug]: Auth configuration working')
    return { success: true }
    
  } catch (error: any) {
    console.error('❌ [Supabase Debug]: Connection failed:', error)
    return { success: false, error: error.message }
  }
}

export async function testSupabaseSignup(email: string, password: string, fullName: string) {
  console.log('🧪 [Supabase Debug]: Testing signup process...')
  console.log('📊 [Supabase Debug]: Email:', email)
  console.log('📊 [Supabase Debug]: Password length:', password.length)
  console.log('📊 [Supabase Debug]: Full name:', fullName)
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    })
    
    console.log('📊 [Supabase Debug]: Signup response data:', data)
    console.log('📊 [Supabase Debug]: Signup response error:', error)
    
    if (error) {
      console.error('❌ [Supabase Debug]: Signup failed:', error)
      return { success: false, error: error.message, details: error }
    }
    
    console.log('✅ [Supabase Debug]: Signup successful')
    return { success: true, data }
    
  } catch (error: any) {
    console.error('❌ [Supabase Debug]: Signup exception:', error)
    return { success: false, error: error.message }
  }
}
