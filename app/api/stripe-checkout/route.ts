import { NextResponse } from "next/server"
import Stripe from "stripe"

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return new NextResponse("Stripe not configured. Set STRIPE_SECRET_KEY in .env.local to enable checkout.", {
      status: 500,
    })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-06-20", // Use a recent API version
  })

  try {
    const { quantity = 1 } = await req.json()

    // Replace with your actual Stripe Price ID
    const priceId = "price_1PZ012R21234567890ABCDEF" // Example Price ID, replace with your own

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: quantity,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/?success=true`,
      cancel_url: `${req.headers.get("origin")}/?canceled=true`,
      metadata: {
        // You can add user ID or other relevant data here
        userId: "some_user_id_from_firebase_auth", // Example: user.uid from Firebase Auth
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error("Stripe checkout error:", error)
    return new NextResponse(`Error creating checkout session: ${error.message}`, { status: 500 })
  }
}
