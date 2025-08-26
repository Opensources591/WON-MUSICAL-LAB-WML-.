"use client"

import { APIStatusChecker } from '@/components/api-status-checker'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Settings } from 'lucide-react'
import Link from 'next/link'

export default function APITestPage() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to App
            </Button>
          </Link>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-6 w-6" />
                RevNet Labs - API Configuration Test
              </CardTitle>
              <CardDescription>
                This page tests all API connections and environment variables to ensure everything is properly configured.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="font-medium">Environment Variables</p>
                    <p className="text-muted-foreground">Checking all required env vars</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="font-medium">API Connections</p>
                    <p className="text-muted-foreground">Testing live API endpoints</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="font-medium">Service Health</p>
                    <p className="text-muted-foreground">Verifying service availability</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <APIStatusChecker />

          <Card>
            <CardHeader>
              <CardTitle>Environment Variables Checklist</CardTitle>
              <CardDescription>
                Ensure these environment variables are set in your Vercel dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm font-mono">
                <div className="flex items-center gap-2">
                  <span className={process.env.NEXT_PUBLIC_SUPABASE_URL ? "text-green-600" : "text-red-600"}>
                    {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅" : "❌"}
                  </span>
                  <code>NEXT_PUBLIC_SUPABASE_URL</code>
                </div>
                <div className="flex items-center gap-2">
                  <span className={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "text-green-600" : "text-red-600"}>
                    {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅" : "❌"}
                  </span>
                  <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
                </div>
                <div className="flex items-center gap-2">
                  <span className={process.env.ELEVENLABS_API_KEY ? "text-green-600" : "text-red-600"}>
                    {process.env.ELEVENLABS_API_KEY ? "✅" : "❌"}
                  </span>
                  <code>ELEVENLABS_API_KEY</code>
                </div>
                <div className="flex items-center gap-2">
                  <span className={process.env.VOICE_ID ? "text-green-600" : "text-red-600"}>
                    {process.env.VOICE_ID ? "✅" : "❌"}
                  </span>
                  <code>VOICE_ID</code>
                </div>
                <div className="flex items-center gap-2">
                  <span className={process.env.BLOB_READ_WRITE_TOKEN ? "text-green-600" : "text-red-600"}>
                    {process.env.BLOB_READ_WRITE_TOKEN ? "✅" : "❌"}
                  </span>
                  <code>BLOB_READ_WRITE_TOKEN</code>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
