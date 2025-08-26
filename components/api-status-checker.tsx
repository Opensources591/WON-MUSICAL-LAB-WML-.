"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, XCircle, RefreshCw, Database, Mic, Cloud } from 'lucide-react'
import { testSupabaseConnection, testElevenLabsConnection, testVercelBlobConnection } from '@/lib/api-test'

interface APIStatus {
  supabase: { success: boolean; error?: string }
  elevenlabs: { success: boolean; error?: string; audioSize?: number }
  vercelBlob: { success: boolean; error?: string; testUrl?: string }
}

export function APIStatusChecker() {
  const [status, setStatus] = useState<APIStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const runTests = async () => {
    setIsLoading(true)
    try {
      const results = {
        supabase: await testSupabaseConnection(),
        elevenlabs: await testElevenLabsConnection(),
        vercelBlob: await testVercelBlobConnection(),
      }
      setStatus(results)
    } catch (error) {
      console.error('Error running API tests:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    runTests()
  }, [])

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    )
  }

  const getStatusBadge = (success: boolean) => {
    return (
      <Badge variant={success ? "default" : "destructive"}>
        {success ? "Connected" : "Failed"}
      </Badge>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          API Connection Status
        </CardTitle>
        <CardDescription>
          Real-time status of all API integrations and services
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Service Health Check</h3>
          <Button
            onClick={runTests}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            {isLoading ? "Testing..." : "Refresh"}
          </Button>
        </div>

        {isLoading && !status && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Testing API connections...</span>
          </div>
        )}

        {status && (
          <div className="space-y-3">
            {/* Supabase Status */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">Supabase Database</p>
                  <p className="text-sm text-muted-foreground">Authentication & Database</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(status.supabase.success)}
                {getStatusBadge(status.supabase.success)}
              </div>
            </div>

            {/* ElevenLabs Status */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Mic className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="font-medium">ElevenLabs API</p>
                  <p className="text-sm text-muted-foreground">
                    Voice Generation
                    {status.elevenlabs.success && status.elevenlabs.audioSize && (
                      <span className="ml-1">({status.elevenlabs.audioSize} bytes generated)</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(status.elevenlabs.success)}
                {getStatusBadge(status.elevenlabs.success)}
              </div>
            </div>

            {/* Vercel Blob Status */}
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Cloud className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">Vercel Blob Storage</p>
                  <p className="text-sm text-muted-foreground">
                    Cloud File Storage
                    {status.vercelBlob.success && status.vercelBlob.testUrl && (
                      <a 
                        href={status.vercelBlob.testUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="ml-1 text-primary hover:underline"
                      >
                        (test file)
                      </a>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(status.vercelBlob.success)}
                {getStatusBadge(status.vercelBlob.success)}
              </div>
            </div>
          </div>
        )}

        {status && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-1">Overall Status:</p>
            <p className="text-sm text-muted-foreground">
              {Object.values(status).every(s => s.success) ? (
                <span className="text-green-600 font-medium">🎉 All services are operational!</span>
              ) : (
                <span className="text-orange-600 font-medium">⚠️ Some services need attention</span>
              )}
            </p>
          </div>
        )}

        {/* Error Details */}
        {status && Object.values(status).some(s => !s.success) && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium text-destructive">Error Details:</p>
            {!status.supabase.success && (
              <p className="text-sm text-muted-foreground">• Supabase: {status.supabase.error}</p>
            )}
            {!status.elevenlabs.success && (
              <p className="text-sm text-muted-foreground">• ElevenLabs: {status.elevenlabs.error}</p>
            )}
            {!status.vercelBlob.success && (
              <p className="text-sm text-muted-foreground">• Vercel Blob: {status.vercelBlob.error}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
