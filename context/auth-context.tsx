"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, fullName: string) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('[Auth Context]: Error getting session:', error)
        } else {
          console.log('[Auth Context]: Initial session:', session?.user?.email || 'No user')
          setSession(session)
          setUser(session?.user ?? null)
        }
      } catch (error) {
        console.error('[Auth Context]: Error in getInitialSession:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[Auth Context]: Auth state changed:', event, session?.user?.email || 'No user')
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      console.log('[Auth Context]: Attempting login for:', email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('[Auth Context]: Login error:', error)
        throw error
      }

      console.log('[Auth Context]: Login successful:', data.user?.email)
    } catch (error) {
      console.error('[Auth Context]: Login failed:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signup = async (email: string, password: string, fullName: string) => {
    setLoading(true)
    try {
      console.log('[Auth Context]: Attempting signup for:', email)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      })

      if (error) {
        console.error('[Auth Context]: Signup error:', error)
        throw error
      }

      console.log('[Auth Context]: Signup successful:', data.user?.email)
    } catch (error) {
      console.error('[Auth Context]: Signup failed:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      console.log('[Auth Context]: Attempting logout')
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('[Auth Context]: Logout error:', error)
        throw error
      }
      console.log('[Auth Context]: Logout successful')
    } catch (error) {
      console.error('[Auth Context]: Logout failed:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    setLoading(true)
    try {
      console.log('[Auth Context]: Attempting password reset for:', email)
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        console.error('[Auth Context]: Password reset error:', error)
        throw error
      }

      console.log('[Auth Context]: Password reset email sent')
    } catch (error) {
      console.error('[Auth Context]: Password reset failed:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, login, signup, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
