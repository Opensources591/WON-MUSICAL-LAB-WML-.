"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Eye, EyeOff, AlertCircle, Mic, Bug } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { login } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      console.log("[LoginPage]: User already logged in, redirecting to home")
      router.push("/")
    }
  }, [user, loading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    if (!email || !password) {
      setError("Please fill in all fields.")
      setIsSubmitting(false)
      return
    }

    try {
      console.log("[LoginPage]: Attempting login for", email)
      await login(email, password)

      toast({
        title: "Login Successful",
        description: "Welcome back to RevNet Labs!",
      })

      console.log("[LoginPage]: Login successful, redirecting")
      router.push("/")
    } catch (err: any) {
      console.error("[LoginPage]: Login error", err)

      // Handle Supabase auth errors
      let errorMessage = "An unexpected error occurred during login."

      if (err.message) {
        switch (err.message) {
          case "Invalid login credentials":
            errorMessage = "Invalid email or password. Please check your credentials and try again."
            break
          case "Email not confirmed":
            errorMessage = "Please check your email and confirm your account before logging in."
            break
          case "Too many requests":
            errorMessage = "Too many login attempts. Please try again later."
            break
          case "Connection error: Missing environment variables":
            errorMessage = "Authentication service is not properly configured. Please contact support."
            break
          default:
            errorMessage = err.message
            break
        }
      }

      setError(errorMessage)
      toast({
        title: "Login Failed",
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

  // Don't render login form if user is already logged in
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
          <CardTitle className="text-3xl font-bold">Login to RevNet Labs</CardTitle>
          <CardDescription>Enter your credentials to access the voice AI platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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
            <div className="flex items-center justify-end">
              <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot Password?
              </Link>
            </div>
            {error && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <div className="flex-1">
                  <p className="text-sm text-destructive">{error}</p>
                  {error.includes("not properly configured") && (
                    <Link href="/debug-auth" className="text-xs text-primary hover:underline mt-1 block">
                      Run authentication debugger →
                    </Link>
                  )}
                </div>
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging In...
                </>
              ) : (
                "Login"
              )}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Sign Up
              </Link>
            </p>

            {/* Debug Link */}
            <div className="text-center pt-4 border-t">
              <Link href="/debug-auth">
                <Button variant="outline" size="sm">
                  <Bug className="mr-2 h-4 w-4" />
                  Debug Authentication Issues
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
