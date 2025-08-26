// Enhanced debugging utilities for authentication issues
export async function debugAuthenticationIssue() {
  console.log("🔍 [Auth Debug]: Starting comprehensive authentication debugging...")

  // Check if we're in browser environment
  if (typeof window === "undefined") {
    console.log("❌ [Auth Debug]: Running on server side, skipping client checks")
    return { error: "Server-side execution" }
  }

  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log("📊 [Auth Debug]: Environment Variables Check")
  console.log("- NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "✅ Set" : "❌ Missing")
  console.log("- NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseAnonKey ? "✅ Set" : "❌ Missing")

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("❌ [Auth Debug]: Missing critical environment variables")
    return {
      error: "Missing environment variables",
      details: {
        supabaseUrl: !!supabaseUrl,
        supabaseAnonKey: !!supabaseAnonKey,
      },
    }
  }

  try {
    // Test Supabase client initialization
    const { supabase } = await import("./supabase")
    console.log("✅ [Auth Debug]: Supabase client imported successfully")

    // Test basic connection
    console.log("🧪 [Auth Debug]: Testing Supabase connection...")
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

    if (sessionError) {
      console.error("❌ [Auth Debug]: Session error:", sessionError)
      return {
        error: "Session error",
        details: sessionError,
      }
    }

    console.log("✅ [Auth Debug]: Session check successful")
    console.log("📊 [Auth Debug]: Current session:", sessionData.session ? "Active" : "None")

    // Test auth state change listener
    console.log("🧪 [Auth Debug]: Testing auth state change listener...")
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("📊 [Auth Debug]: Auth state change:", event, session?.user?.email || "No user")
    })

    // Clean up subscription after a short delay
    setTimeout(() => {
      subscription.unsubscribe()
      console.log("🧹 [Auth Debug]: Cleaned up auth listener")
    }, 1000)

    return {
      success: true,
      details: {
        supabaseUrl: supabaseUrl.substring(0, 30) + "...",
        hasSession: !!sessionData.session,
        userEmail: sessionData.session?.user?.email || null,
      },
    }
  } catch (error: any) {
    console.error("❌ [Auth Debug]: Critical error:", error)
    return {
      error: "Critical authentication error",
      details: error.message,
    }
  }
}

// Test login functionality with detailed logging
export async function testLoginFlow(email: string, password: string) {
  console.log("🧪 [Auth Debug]: Testing login flow...")
  console.log("📊 [Auth Debug]: Email:", email)
  console.log("📊 [Auth Debug]: Password length:", password.length)

  try {
    const { supabase } = await import("./supabase")

    console.log("🔄 [Auth Debug]: Attempting login...")
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    console.log("📊 [Auth Debug]: Login response data:", data)
    console.log("📊 [Auth Debug]: Login response error:", error)

    if (error) {
      console.error("❌ [Auth Debug]: Login failed:", error)
      return {
        success: false,
        error: error.message,
        details: error,
      }
    }

    if (data.user) {
      console.log("✅ [Auth Debug]: Login successful")
      console.log("📊 [Auth Debug]: User ID:", data.user.id)
      console.log("📊 [Auth Debug]: User email:", data.user.email)
      console.log("📊 [Auth Debug]: Email confirmed:", data.user.email_confirmed_at ? "Yes" : "No")

      return {
        success: true,
        user: data.user,
        session: data.session,
      }
    }

    console.error("❌ [Auth Debug]: No user data returned")
    return {
      success: false,
      error: "No user data returned",
    }
  } catch (error: any) {
    console.error("❌ [Auth Debug]: Login exception:", error)
    return {
      success: false,
      error: error.message,
      details: error,
    }
  }
}
