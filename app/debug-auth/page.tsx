"use client"

import { AuthDebugger } from "@/components/auth-debugger"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function DebugAuthPage() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <Link href="/login">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Button>
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-bold">Authentication Debugger</h1>
          <p className="text-muted-foreground mt-2">Diagnose and fix authentication issues with your RevNet Labs app</p>
        </div>

        <AuthDebugger />
      </div>
    </div>
  )
}
