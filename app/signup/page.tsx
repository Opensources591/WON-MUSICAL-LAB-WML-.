"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Eye, EyeOff, AlertCircle, CheckCircle, Mic, Settings } from 'lucide-react'
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { signUp } from "@/lib/auth"
import { debugSupabaseConnection } from "@/lib/supabase-debug"
import { useToast } from "@/hooks/use-toast"

export default function SignUpPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  // Test Supabase connection on component mount
  useEffect(() => {
    const testConnection = async () => {
      const result = await debugSupabaseConnection()
      if (!result.success) {
        setDebugInfo(`Connection issue: ${result.error}`)
        console.error('Supabase connection failed:', result.error)
      } else {
        setDebugInfo('Supabase connection: ✅ Working')
        console.log('Supabase connection: ✅ Working')
      }
    }
    
    testConnection()
  }, [])

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      console.log("[SignUpPage]: User already logged in, redirecting to home")
      router.push("/")
    }
  }, [user, loading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setIsSubmitting(true)

    // Client-side validation
    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.")
      setIsSubmitting(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      setIsSubmitting(false)
      return
    }

    if (password.length < 6) {
      setError("Password should be at least 6 characters.")
      setIsSubmitting(false)
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.")
      setIsSubmitting(false)
      return
    }

    try {
      console.log("[SignUpPage]: Starting signup process")
      console.log("[SignUpPage]: Email:", email)
      console.log("[SignUpPage]: Full name:", fullName)
      
      await signUp(email, password, fullName)
      
      console.log("[SignUpPage]: Signup successful")
      setSuccess("Account created successfully! Please check your email to confirm your account before logging in.")
      
      toast({
        title: "Account Created Successfully! 🎉",
        description: "Please check your email to confirm your account.",
      })
      
      // Clear form
      setFullName("")
      setEmail("")
      setPassword("")
      setConfirmPassword("")
      
      // Redirect after a delay
      setTimeout(() => {
        router.push("/login")
      }, 3000)
    } catch (err: any) {
      console.error("[SignUpPage]: Signup error:", err)
      
      let errorMessage = err.message || "An unexpected error occurred during sign up."
      
      // Add debugging information to error message
      if (errorMessage.includes('Connection error')) {
        errorMessage += " Please check your internet connection and try again."
      }
      
      setError(errorMessage)
      toast({
        title: "Signup Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  // Don't render signup form if user is already logged in
  if (user) {
    return null
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Mic className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Sign Up for RevNet Labs</CardTitle>
          <CardDescription>Create your account to start generating AI voices.</CardDescription>
          
          {/* Debug Information */}
          {debugInfo && (
            <div className="mt-2 p-2 bg-muted rounded text-xs text-muted-foreground">
              {debugInfo}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="full-name">Full Name</Label>
              <Input
                id="full-name"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="relative space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isSubmitting}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute inset-y-0 right-0 flex items-center justify-center px-3 py-2 top-auto"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <div className="relative space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isSubmitting}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute inset-y-0 right-0 flex items-center justify-center px-3 py-2 top-auto"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            
            {error && (
              <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                <div className="text-sm text-destructive">
                  <p className="font-medium">Signup Failed</p>
                  <p>{error}</p>
                  {error.includes('Connection error') && (
                    <div className="mt-2 text-xs">
                      <p>Troubleshooting steps:</p>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>Check your internet connection</li>
                        <li>Try refreshing the page</li>
                        <li>Contact support if the issue persists</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {success && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <p className="text-sm text-green-600">{success}</p>
              </div>
            )}
            
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
            
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Login
              </Link>
            </p>
            
            <div className="text-center">
              <Link href="/api-test">
                <Button variant="outline" size="sm">
                  <Settings className="mr-2 h-4 w-4" />
                  Test API Connections
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
