import { createClient } from "@supabase/supabase-js"

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY",
  )
}

// Create a singleton instance for the browser
let browserClient: ReturnType<typeof createClient> | null = null

export const getSupabaseBrowser = () => {
  if (typeof window === "undefined") {
    throw new Error("getSupabaseBrowser should only be used in client components")
  }

  if (!browserClient) {
    browserClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: {
          getItem: (key) => {
            try {
              return localStorage.getItem(key)
            } catch (error) {
              console.error('Error reading from localStorage:', error)
              return null
            }
          },
          setItem: (key, value) => {
            try {
              localStorage.setItem(key, value)
            } catch (error) {
              console.error('Error writing to localStorage:', error)
            }
          },
          removeItem: (key) => {
            try {
              localStorage.removeItem(key)
            } catch (error) {
              console.error('Error removing from localStorage:', error)
            }
          }
        }
      },
    })
  }

  return browserClient
}

// For server components
export const getSupabaseServer = () => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })
}

// For backward compatibility
export const supabase = typeof window !== "undefined" ? getSupabaseBrowser() : getSupabaseServer()
