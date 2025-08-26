import * as functions from "firebase-functions"
import * as admin from "firebase-admin"

// Initialize Firebase Admin SDK
// This will automatically pick up credentials when deployed to Cloud Functions
// For local development, ensure you've set up your GOOGLE_APPLICATION_CREDENTIALS
// or run `firebase emulators:start`
admin.initializeApp()

/**
 * HTTP-triggered Cloud Function to send a welcome email (simulated).
 *
 * This function accepts an email address via a POST request and logs a welcome message.
 * It's a basic scaffold to demonstrate Cloud Functions integration.
 *
 * To test locally:
 * 1. Navigate to the `functions` directory in your terminal.
 * 2. Run `npm run serve` (or `yarn serve` / `bun serve`).
 * 3. Use curl:
 *    `curl -X POST -H "Content-Type: application/json" -d '{"email": "test@example.com"}' http://localhost:5001/revnet-labs-43dca/us-central1/sendWelcomeEmail`
 *
 * To test after deployment:
 * 1. Get the function URL from the Firebase Console or `firebase functions:url sendWelcomeEmail`.
 * 2. Use curl:
 *    `curl -X POST -H "Content-Type: application/json" -d '{"email": "user@example.com"}' YOUR_FUNCTION_URL`
 */
export const sendWelcomeEmail = functions.https.onRequest(async (req, res) => {
  // Ensure it's a POST request
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed")
  }

  // Ensure content type is JSON
  if (req.headers["content-type"] !== "application/json") {
    return res.status(400).send("Content-Type must be application/json")
  }

  const { email } = req.body

  if (!email) {
    return res.status(400).send("Email is required in the request body.")
  }

  console.log(`[Cloud Function] Simulating welcome email to: ${email}`)

  // In a real application, you would integrate with an email service here (e.g., SendGrid, Nodemailer)
  // Example:
  // await sendEmailService.send({ to: email, subject: 'Welcome!', body: '...' });

  res.status(200).json({ message: `Welcome email simulated for ${email}. Check Cloud Function logs.` })
})
