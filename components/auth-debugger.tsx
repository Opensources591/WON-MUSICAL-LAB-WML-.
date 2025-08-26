"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle, XCircle, Bug, Eye, EyeOff } from "lucide-react"
import { debugAuthenticationIssue, testLoginFlow } from "@/lib/debug-auth"

export function AuthDebugger() {
  const [debugResult, setDebugResult] = useState<any>(null)
  const [isDebugging, setIsDebugging] = useState(false)
  const [testEmail, setTestEmail] = useState("")
  const [testPassword, setTestPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loginTestResult, setLoginTestResult] = useState<any>(null)
  const [isTestingLogin, setIsTestingLogin] = useState(false)

  const runDebug = async () => {
    setIsDebugging(true)
    try {
      const result = await debugAuthenticationIssue()
      setDebugResult(result)
    } catch (error) {
      console.error("Debug error:", error)
      setDebugResult({ error: "Debug failed", details: error })
    } finally {
      setIsDebugging(false)
    }
  }

  const testLogin = async () => {
    if (!testEmail || !testPassword) {
      setLoginTestResult({ error: "Please enter email and password" })
      return
    }

    setIsTestingLogin(true)
    try {
      const result = await testLoginFlow(testEmail, testPassword)
      setLoginTestResult(result)
    } catch (error) {
      console.error("Login test error:", error)
      setLoginTestResult({ error: "Login test failed", details: error })
    } finally {
      setIsTestingLogin(false)
    }
  }

  useEffect(() => {
    runDebug()
  }, [])

  const getStatusIcon = (success: boolean) => {
    return success ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5" />
            Authentication Debugger
          </CardTitle>
          <CardDescription>Diagnose authentication issues and test Supabase connection</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">System Status Check</h3>
            <Button onClick={runDebug} disabled={isDebugging} variant="outline" size="sm">
              {isDebugging ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Bug className="h-4 w-4 mr-2" />}
              {isDebugging ? "Debugging..." : "Run Debug"}
            </Button>
          </div>

          {isDebugging && !debugResult && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Running authentication diagnostics...</span>
            </div>
          )}

          {debugResult && (
            <div className="space-y-3">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {getStatusIcon(debugResult.success)}
                  <span className="font-medium">
                    {debugResult.success ? "Authentication System Working" : "Authentication Issues Detected"}
                  </span>
                </div>

                {debugResult.error && (
                  <div className="text-sm text-red-600 mb-2">
                    <strong>Error:</strong> {debugResult.error}
                  </div>
                )}

                {debugResult.details && (
                  <details className="text-sm">
                    <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                      View Details
                    </summary>
                    <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                      {JSON.stringify(debugResult.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Login Flow Test</CardTitle>
          <CardDescription>Test the login functionality with your credentials</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="test-email">Test Email</Label>
              <Input
                id="test-email"
                type="email"
                placeholder="your@email.com"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="test-password">Test Password</Label>
              <div className="relative">
                <Input
                  id="test-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={testPassword}
                  onChange={(e) => setTestPassword(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute inset-y-0 right-0 flex items-center justify-center px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          <Button onClick={testLogin} disabled={isTestingLogin} className="w-full">
            {isTestingLogin ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Bug className="h-4 w-4 mr-2" />}
            {isTestingLogin ? "Testing Login..." : "Test Login"}
          </Button>

          {loginTestResult && (
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                {getStatusIcon(loginTestResult.success)}
                <span className="font-medium">
                  {loginTestResult.success ? "Login Test Successful" : "Login Test Failed"}
                </span>
              </div>

              {loginTestResult.error && (
                <div className="text-sm text-red-600 mb-2">
                  <strong>Error:</strong> {loginTestResult.error}
                </div>
              )}

              {loginTestResult.user && (
                <div className="text-sm text-green-600 mb-2">
                  <strong>Success:</strong> Logged in as {loginTestResult.user.email}
                </div>
              )}

              {loginTestResult.details && (
                <details className="text-sm">
                  <summary className="cursor-pointer text-muted-foreground hover:text-foreground">View Details</summary>
                  <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                    {JSON.stringify(loginTestResult.details, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Common Issues & Solutions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="p-3 border rounded-lg">
              <div className="font-medium text-red-600 mb-1">❌ Missing Environment Variables</div>
              <p className="text-muted-foreground mb-2">
                NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY not set
              </p>
              <p className="text-xs">
                <strong>Solution:</strong> Add these variables in your Vercel project settings under Environment
                Variables
              </p>
            </div>

            <div className="p-3 border rounded-lg">
              <div className="font-medium text-red-600 mb-1">❌ Invalid Login Credentials</div>
              <p className="text-muted-foreground mb-2">Email or password is incorrect</p>
              <p className="text-xs">
                <strong>Solution:</strong> Verify your credentials or create a new account via Sign Up
              </p>
            </div>

            <div className="p-3 border rounded-lg">
              <div className="font-medium text-red-600 mb-1">❌ Email Not Confirmed</div>
              <p className="text-muted-foreground mb-2">Account exists but email hasn't been confirmed</p>
              <p className="text-xs">
                <strong>Solution:</strong> Check your email inbox and click the confirmation link
              </p>
            </div>

            <div className="p-3 border rounded-lg">
              <div className="font-medium text-red-600 mb-1">❌ Supabase Project Issues</div>
              <p className="text-muted-foreground mb-2">Supabase project is paused or has configuration issues</p>
              <p className="text-xs">
                <strong>Solution:</strong> Check your Supabase dashboard and ensure the project is active
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
