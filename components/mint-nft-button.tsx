"use client"

import { Button } from "@/components/ui/button"
import { Loader2, Gem } from "lucide-react"
import { useState } from "react"

export function MintNftButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleMint = async () => {
    setIsLoading(true)
    setMessage(null)
    setError(null)
    try {
      const response = await fetch("/api/mint-nft", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // You might send user-specific data here if needed for the NFT
        body: JSON.stringify({}),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || "Failed to mint NFT.")
      }

      const data = await response.json()
      setMessage(`NFT minted successfully! Transaction ID: ${data.data.id}`)
    } catch (err: any) {
      console.error("Error minting NFT:", err)
      setError(err.message || "An unexpected error occurred during NFT minting.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Button onClick={handleMint} disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Minting NFT...
          </>
        ) : (
          <>
            <Gem className="mr-2 h-4 w-4" />
            Mint Exclusive NFT
          </>
        )}
      </Button>
      {message && <p className="text-sm text-green-600 text-center">{message}</p>}
      {error && <p className="text-sm text-destructive text-center">{error}</p>}
    </div>
  )
}
