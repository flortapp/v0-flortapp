import { createClient } from "@supabase/supabase-js"

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Log for debugging, but don't expose the actual values
console.log("Supabase initialization status:", {
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey,
})

// Create a safer initialization function
const createSafeClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase credentials. Make sure environment variables are set.")

    // Create a dummy client with all required methods to prevent runtime errors
    return {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        getUser: async () => ({ data: { user: null }, error: null }),
        signInWithPassword: async () => ({ data: { user: null, session: null }, error: null }),
        signOut: async () => ({ error: null }),
        onAuthStateChange: (callback: any) => {
          console.warn("Auth state change listener called with dummy client")
          return { data: { subscription: { unsubscribe: () => {} } } }
        },
      },
      from: () => ({
        select: () => ({ data: null, error: null }),
        insert: () => ({ data: null, error: null }),
        update: () => ({ data: null, error: null }),
        delete: () => ({ data: null, error: null }),
      }),
    } as any
  }

  // Create the real client if credentials are available
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Create a singleton instance for the browser
let browserClient: ReturnType<typeof createClient> | null = null

export const getSupabaseBrowser = () => {
  if (typeof window === "undefined") {
    throw new Error("getSupabaseBrowser should only be used in client components")
  }

  if (!browserClient) {
    browserClient = createSafeClient()
  }

  return browserClient
}

// For server components
export const getSupabaseServer = () => {
  return createSafeClient()
}

// For backward compatibility
export const supabase = typeof window !== "undefined" ? getSupabaseBrowser() : getSupabaseServer()
