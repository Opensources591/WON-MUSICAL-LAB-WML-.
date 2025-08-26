import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"

// Ensure environment variables are set
if (
  !process.env.FIREBASE_PRIVATE_KEY ||
  !process.env.FIREBASE_CLIENT_EMAIL ||
  !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
) {
  throw new Error(
    "Missing Firebase Admin SDK environment variables. " +
      "Ensure FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL, and NEXT_PUBLIC_FIREBASE_PROJECT_ID are set.",
  )
}

const serviceAccount = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"), // Handle newline characters
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
}

// Initialize Firebase Admin SDK only once
if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  })
}

export const adminAuth = getAuth()
