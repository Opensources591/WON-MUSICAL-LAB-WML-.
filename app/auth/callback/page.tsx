"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AuthCallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('[Auth Callback]: Processing authentication callback')
        
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('[Auth Callback]: Error getting session:', error)
          setStatus('error')
          setMessage(`Authentication failed: ${error.message}`)
          return
        }

        if (data.session) {
          console.log('[Auth Callback]: Session found, user authenticated')
          setStatus('success')
          setMessage('Email confirmed successfully! Redirecting to your dashboard...')
          
          // Redirect to home page after a short delay
          setTimeout(() => {
            router.push('/')
          }, 2000)
        } else {
          console.log('[Auth Callback]: No session found')
          setStatus('error')
          setMessage('No authentication session found. Please try logging in again.')
        }
      } catch (error: any) {
        console.error('[Auth Callback]: Exception:', error)
        setStatus('error')
        setMessage(`An unexpected error occurred: ${error.message}`)
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Email Confirmation</CardTitle>
          <CardDescription>Processing your email confirmation...</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {status === 'loading' && (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
              <p className="text-muted-foreground">Confirming your email address...</p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <p className="text-green-600 font-medium">{message}</p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <XCircle className="h-12 w-12 text-red-500 mx-auto" />
              <p className="text-red-600 font-medium">{message}</p>
              <div className="space-y-2">
                <Button onClick={() => router.push('/login')} className="w-full">
                  Go to Login
                </Button>
                <Button onClick={() => router.push('/signup')} variant="outline" className="w-full">
                  Try Signing Up Again
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
