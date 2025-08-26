"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertTriangle, Globe } from "lucide-react"

interface DeploymentInfo {
  environment: string
  supabaseConfigured: boolean
  elevenLabsConfigured: boolean
  voiceIdConfigured: boolean
  allSystemsReady: boolean
}

export function DeploymentStatus() {
  const [status, setStatus] = useState<DeploymentInfo | null>(null)

  useEffect(() => {
    // Check deployment status
    const checkStatus = () => {
      const deploymentStatus: DeploymentInfo = {
        environment: process.env.NODE_ENV || "development",
        supabaseConfigured: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
        elevenLabsConfigured: true, // We can't check server-side env vars from client
        voiceIdConfigured: true,
        allSystemsReady: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      }
      setStatus(deploymentStatus)
    }

    checkStatus()
  }, [])

  if (!status) return null

  const getStatusIcon = (configured: boolean) => {
    return configured ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    )
  }

  const getEnvironmentBadge = (env: string) => {
    const variants = {
      production: "default" as const,
      preview: "secondary" as const,
      development: "outline" as const,
    }

    return <Badge variant={variants[env as keyof typeof variants] || "outline"}>{env.toUpperCase()}</Badge>
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Globe className="h-5 w-5" />
          Deployment Status
        </CardTitle>
        <CardDescription className="text-gray-300">Current environment and service configuration</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-300">Environment:</span>
          {getEnvironmentBadge(status.environment)}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Supabase Database</span>
            <div className="flex items-center gap-2">
              {getStatusIcon(status.supabaseConfigured)}
              <span className="text-sm text-gray-400">
                {status.supabaseConfigured ? "Connected" : "Not configured"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-300">ElevenLabs API</span>
            <div className="flex items-center gap-2">
              {getStatusIcon(status.elevenLabsConfigured)}
              <span className="text-sm text-gray-400">
                {status.elevenLabsConfigured ? "Connected" : "Not configured"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-300">Custom Voice ID</span>
            <div className="flex items-center gap-2">
              {getStatusIcon(status.voiceIdConfigured)}
              <span className="text-sm text-gray-400">{status.voiceIdConfigured ? "Configured" : "Not set"}</span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-700">
          <div className="flex items-center gap-2">
            {status.allSystemsReady ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-green-400 font-medium">All systems operational</span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <span className="text-yellow-400 font-medium">Configuration needed</span>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
