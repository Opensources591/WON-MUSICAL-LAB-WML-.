import { supabase } from './supabase'
import { debugSupabaseConnection } from './supabase-debug'
import type { User } from '@supabase/supabase-js'

// Sign up user with enhanced error handling
export async function signUp(email: string, password: string, fullName: string) {
  console.log('[Auth]: Starting signup process for', email)
  
  // First, test the connection
  const connectionTest = await debugSupabaseConnection()
  if (!connectionTest.success) {
    console.error('[Auth]: Connection test failed:', connectionTest.error)
    throw new Error(`Connection error: ${connectionTest.error}`)
  }
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })

    console.log('[Auth]: Signup response:', { data, error })

    if (error) {
      console.error('[Auth]: Signup error details:', error)
      
      // Handle specific Supabase errors
      switch (error.message) {
        case 'User already registered':
          throw new Error('An account with this email already exists. Please try logging in instead.')
        case 'Password should be at least 6 characters':
          throw new Error('Password must be at least 6 characters long.')
        case 'Unable to validate email address: invalid format':
          throw new Error('Please enter a valid email address.')
        case 'Signup is disabled':
          throw new Error('Account registration is currently disabled. Please contact support.')
        default:
          throw new Error(`Signup failed: ${error.message}`)
      }
    }

    if (!data.user) {
      throw new Error('Signup failed: No user data returned')
    }

    console.log('[Auth]: Signup successful for', data.user.email)
    return data.user
  } catch (error: any) {
    console.error('[Auth]: Signup exception:', error)
    throw error
  }
}

// Login user with enhanced error handling
export async function login(email: string, password: string) {
  console.log('[Auth]: Starting login process for', email)
  
  // Test connection first
  const connectionTest = await debugSupabaseConnection()
  if (!connectionTest.success) {
    console.error('[Auth]: Connection test failed:', connectionTest.error)
    throw new Error(`Connection error: ${connectionTest.error}`)
  }
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    console.log('[Auth]: Login response:', { data, error })

    if (error) {
      console.error('[Auth]: Login error details:', error)
      
      // Handle specific Supabase errors
      switch (error.message) {
        case 'Invalid login credentials':
          throw new Error('Invalid email or password. Please check your credentials and try again.')
        case 'Email not confirmed':
          throw new Error('Please check your email and confirm your account before logging in.')
        case 'Too many requests':
          throw new Error('Too many login attempts. Please wait a few minutes and try again.')
        default:
          throw new Error(`Login failed: ${error.message}`)
      }
    }

    if (!data.user) {
      throw new Error('Login failed: No user data returned')
    }

    console.log('[Auth]: Login successful for', data.user.email)
    return data.user
  } catch (error: any) {
    console.error('[Auth]: Login exception:', error)
    throw error
  }
}

// Logout user
export async function logout() {
  console.log('[Auth]: Starting logout process')
  try {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('[Auth]: Logout error:', error)
      throw new Error(`Logout failed: ${error.message}`)
    }

    console.log('[Auth]: Logout successful')
  } catch (error: any) {
    console.error('[Auth]: Logout exception:', error)
    throw error
  }
}

// Reset password
export async function resetPassword(email: string) {
  console.log('[Auth]: Starting password reset for', email)
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) {
      console.error('[Auth]: Password reset error:', error)
      throw new Error(`Password reset failed: ${error.message}`)
    }

    console.log('[Auth]: Password reset email sent successfully')
  } catch (error: any) {
    console.error('[Auth]: Password reset exception:', error)
    throw error
  }
}

// Get current user
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('[Auth]: Get user error:', error)
      return null
    }
    
    return user
  } catch (error: any) {
    console.error('[Auth]: Get user exception:', error)
    return null
  }
}
