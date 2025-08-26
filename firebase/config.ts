import { initializeApp, getApps, type FirebaseOptions, type FirebaseApp } from "firebase/app"
import { getAuth, type Auth } from "firebase/auth"

/**
 * Firebase configuration using environment variables.
 * All values are read from NEXT_PUBLIC_* env vars so they're available
 * on both client and server in production.
 */
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

let firebaseApp: FirebaseApp | null = null
let firebaseAuth: Auth | null = null

const requiredPublicKeys = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
] as const

// Check for missing environment variables
const missingPublicKeys = requiredPublicKeys.filter((k) => !process.env[k])

if (missingPublicKeys.length > 0) {
  console.error(
    `[Firebase Error]: Missing required Firebase environment variables: ${missingPublicKeys.join(", ")}. ` +
      `Please add them to your Vercel environment variables and redeploy.`,
  )
  
  // In production, we still want to export something to prevent build errors
  if (typeof window !== 'undefined') {
    alert(`Firebase configuration error. Missing environment variables: ${missingPublicKeys.join(", ")}`)
  }
} else {
  // Only initialize if all required keys are present
  try {
    firebaseApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
    firebaseAuth = getAuth(firebaseApp)
    console.log("[Firebase]: Successfully initialized")
  } catch (error) {
    console.error("[Firebase]: Initialization failed", error)
  }
}

export const app = firebaseApp
export const auth = firebaseAuth
