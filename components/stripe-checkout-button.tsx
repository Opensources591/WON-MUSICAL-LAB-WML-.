"use client"

import { Button } from "@/components/ui/button"
import { Loader2, CreditCard } from "lucide-react"
import { useState } from "react"

interface StripeCheckoutButtonProps {
  quantity?: number
}

export function StripeCheckoutButton({ quantity = 1 }: StripeCheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckout = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/stripe-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || "Failed to create checkout session.")
      }

      const { url } = await response.json()
      window.location.href = url // Redirect to Stripe Checkout
    } catch (err: any) {
      console.error("Error during Stripe checkout:", err)
      setError(err.message || "An unexpected error occurred during checkout.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Button onClick={handleCheckout} disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Redirecting...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Buy Voice Credits
          </>
        )}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
