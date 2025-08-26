"use client"

import { TestDashboard } from '@/components/test-dashboard'
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function TestSuitePage() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to App
            </Button>
          </Link>
        </div>

        <TestDashboard />
      </div>
    </div>
  )
}
