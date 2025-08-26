"use client"

import { useState, useEffect } from "react"
import { TextInput } from "@/components/TextInput"
import { StyleSelector } from "@/components/StyleSelector"
import { AudioPlayer } from "@/components/AudioPlayer"
import { Button } from "@/components/ui/button"
import { Loader2, Music, Sparkles, Download } from "lucide-react"
import { supabase, type Track } from "@/lib/supabase"
import { DeploymentStatus } from "@/components/DeploymentStatus"

export default function HomePage() {
  const [prompt, setPrompt] = useState("")
  const [style, setStyle] = useState("traditional-gospel")
  const [language, setLanguage] = useState<"english" | "yoruba" | "pidgin">("english")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null)
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [recentTracks, setRecentTracks] = useState<Track[]>([])
  const [error, setError] = useState<string | null>(null)

  // Load recent tracks on mount
  useEffect(() => {
    loadRecentTracks()
  }, [])

  const loadRecentTracks = async () => {
    try {
      const { data, error } = await supabase
        .from("won_tracks")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5)

      if (error) throw error
      setRecentTracks(data || [])
    } catch (error) {
      console.error("Failed to load recent tracks:", error)
    }
  }

  const generateAudio = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt for your gospel track")
      return
    }

    setIsGenerating(true)
    setError(null)
    setGeneratedAudio(null)

    try {
      const response = await fetch("/api/generate-audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          style,
          language,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate audio")
      }

      setGeneratedAudio(data.audioUrl)
      setCurrentTrack(data.track)

      // Refresh recent tracks
      loadRecentTracks()

      // Show success message
      if ("serviceWorker" in navigator && "Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification("🎵 Gospel Track Ready!", {
            body: "Your WON MUSICALS track has been generated successfully.",
            icon: "/icon-192.png",
          })
        }
      }
    } catch (error: any) {
      console.error("Generation failed:", error)
      setError(error.message || "Failed to generate audio. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const requestNotificationPermission = async () => {
    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission()
    }
  }

  useEffect(() => {
    requestNotificationPermission()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      {/* Header */}
      <header className="text-center py-8 px-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <Music className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            WON MUSICALS
          </h1>
        </div>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Generate beautiful gospel music with AI-powered voice synthesis
        </p>
        <p className="text-gray-400 text-sm mt-2">
          🌍 English • Yorùbá • Pidgin | 🎤 Custom Gospel Voice | ⏱️ Up to 59 seconds
        </p>
      </header>

      {/* Deployment Status (only show in development) */}
      {process.env.NODE_ENV === "development" && (
        <div className="mb-8">
          <DeploymentStatus />
        </div>
      )}

      <main className="container mx-auto px-4 pb-8 max-w-4xl">
        {/* Generation Form */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-700">
          <div className="space-y-8">
            <TextInput value={prompt} onChange={setPrompt} language={language} onLanguageChange={setLanguage} />

            <StyleSelector value={style} onChange={setStyle} />

            {error && (
              <div className="bg-red-900/50 border border-red-700 rounded-lg p-4">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            <Button
              onClick={generateAudio}
              disabled={isGenerating || !prompt.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 text-lg rounded-xl"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                  Generating Your Gospel Track...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-3" />
                  Generate Gospel Audio
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Generated Audio Player */}
        {generatedAudio && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">🎵 Your Generated Gospel Track</h2>
            <AudioPlayer
              audioUrl={generatedAudio}
              title={currentTrack?.prompt.substring(0, 50) + "..." || "Gospel Track"}
              onDownload={() => console.log("Track downloaded")}
            />
          </div>
        )}

        {/* Recent Tracks */}
        {recentTracks.length > 0 && (
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Download className="h-5 w-5" />
              Recent Gospel Tracks
            </h2>
            <div className="space-y-3">
              {recentTracks.map((track) => (
                <div key={track.id} className="bg-gray-700/50 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm mb-1">{track.prompt.substring(0, 60)}...</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span>🎨 {track.style.replace("-", " ")}</span>
                      <span>🌍 {track.language}</span>
                      <span>⏱️ ~{track.duration}s</span>
                    </div>
                  </div>
                  {track.audio_url && (
                    <Button
                      onClick={() => setGeneratedAudio(track.audio_url)}
                      variant="outline"
                      size="sm"
                      className="ml-4"
                    >
                      Play
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-6 px-4 border-t border-gray-800">
        <p className="text-gray-400 text-sm">Built with ❤️ for the Gospel | Powered by ElevenLabs AI</p>
        <p className="text-gray-500 text-xs mt-1">WON MUSICALS - Spreading the Gospel through AI-generated music</p>
      </footer>
    </div>
  )
}
