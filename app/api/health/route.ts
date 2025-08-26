import { NextResponse } from "next/server"
import { checkDeploymentStatus } from "@/lib/deployment-check"

export async function GET() {
  try {
    const status = checkDeploymentStatus()

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      deployment: status,
      services: {
        supabase: status.supabaseConfigured ? "connected" : "not configured",
        elevenlabs: status.elevenLabsConfigured ? "connected" : "not configured",
        voice: status.voiceIdConfigured ? "configured" : "not configured",
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
