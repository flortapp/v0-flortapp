"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { getSupabaseBrowser } from "@/lib/supabase"
import { useRouter } from "next/navigation"

type User = {
  id: string
  email: string
  username?: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Token management utilities
const TOKEN_STORAGE_KEY = "flortapp_auth_tokens"

interface StoredTokens {
  access_token: string
  refresh_token: string
  expires_at: number
  user: User
}

const storeTokens = (session: any, user: User) => {
  if (typeof window === "undefined") return

  try {
    // Ensure we have all required token data
    if (!session?.access_token || !session?.refresh_token) {
      console.error("Incomplete session data, not storing tokens")
      return
    }

    const tokens: StoredTokens = {
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      expires_at: Date.now() + 3600 * 1000, // Default to 1 hour if expires_at is not available
      user,
    }

    localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens))
  } catch (error) {
    console.error("Error storing tokens:", error)
  }
}

const getStoredTokens = (): StoredTokens | null => {
  if (typeof window === "undefined") return null

  try {
    const stored = localStorage.getItem(TOKEN_STORAGE_KEY)
    if (!stored) return null

    const tokens = JSON.parse(stored) as StoredTokens

    // Validate token structure
    if (!tokens.access_token || !tokens.refresh_token || !tokens.user) {
      console.warn("Invalid token structure in storage, clearing")
      clearStoredTokens()
      return null
    }

    return tokens
  } catch (error) {
    console.error("Error parsing stored tokens:", error)
    clearStoredTokens()
    return null
  }
}

const clearStoredTokens = () => {
  if (typeof window === "undefined") return
  localStorage.removeItem(TOKEN_STORAGE_KEY)
}

const isTokenValid = (tokens: StoredTokens): boolean => {
  if (!tokens || !tokens.expires_at) return false

  const now = Date.now()
  const bufferTime = 5 * 60 * 1000 // 5 minutes buffer
  return tokens.expires_at > now + bufferTime
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const supabase = getSupabaseBrowser()

        // First check for an existing session directly with Supabase
        const { data: sessionData } = await supabase.auth.getSession()

        if (sessionData?.session) {
          // We already have a valid session, use it
          const userData: User = {
            id: sessionData.session.user.id,
            email: sessionData.session.user.email || "",
            username: sessionData.session.user.email?.split("@")[0] || "",
          }

          setUser(userData)
          storeTokens(sessionData.session, userData)
          setLoading(false)
          return
        }

        // No active session, try to restore from stored tokens
        const storedTokens = getStoredTokens()

        if (storedTokens && isTokenValid(storedTokens)) {
          try {
            // Use the refresh token to get a new session
            const { data, error } = await supabase.auth.refreshSession({
              refresh_token: storedTokens.refresh_token,
            })

            if (error) {
              console.warn("Failed to refresh session:", error.message)
              clearStoredTokens()
            } else if (data?.session) {
              // Successfully refreshed the session
              const userData: User = {
                id: data.session.user.id,
                email: data.session.user.email || "",
                username: data.session.user.email?.split("@")[0] || "",
              }

              setUser(userData)
              storeTokens(data.session, userData)
            }
          } catch (refreshError) {
            console.error("Error refreshing session:", refreshError)
            clearStoredTokens()
          }
        } else if (storedTokens) {
          // Tokens exist but are invalid
          clearStoredTokens()
        }
      } catch (error) {
        console.error("Unexpected error in initializeAuth:", error)
        clearStoredTokens()
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const supabase = getSupabaseBrowser()

    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event)

      if (event === "SIGNED_IN" && session) {
        const userData: User = {
          id: session.user.id,
          email: session.user.email || "",
          username: session.user.email?.split("@")[0] || "",
        }

        setUser(userData)
        storeTokens(session, userData)

        // Use window.location for more reliable navigation
        window.location.href = "/"
      } else if (event === "SIGNED_OUT") {
        setUser(null)
        clearStoredTokens()

        // Only redirect if we're not already on the login page
        if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
          window.location.href = "/login"
        }
      } else if (event === "TOKEN_REFRESHED" && session) {
        // Update stored tokens when refreshed
        if (user) {
          storeTokens(session, user)
        }
      }
    })

    return () => {
      data?.subscription?.unsubscribe?.()
    }
  }, [router, user])

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const supabase = getSupabaseBrowser()

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) {
        console.error("Login error:", error.message)
        return { error }
      }

      if (data?.session) {
        const userData: User = {
          id: data.session.user.id,
          email: data.session.user.email || "",
          username: data.session.user.email?.split("@")[0] || "",
        }

        setUser(userData)
        storeTokens(data.session, userData)
        return { error: null }
      }

      return { error: new Error("No session returned after login") }
    } catch (err) {
      console.error("Unexpected auth error:", err)
      return { error: err }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const supabase = getSupabaseBrowser()

      // Sign out from Supabase
      await supabase.auth.signOut()

      // Clear local state
      setUser(null)
      clearStoredTokens()

      // Force clear localStorage as a fallback
      if (typeof window !== "undefined") {
        localStorage.removeItem(TOKEN_STORAGE_KEY)
        // Clear any other auth-related items
        localStorage.removeItem("supabase.auth.token")
      }

      console.log("User signed out successfully")

      // Navigate to login page
      window.location.href = "/login"
    } catch (error) {
      console.error("Error signing out:", error)
      // Force clear even on error
      setUser(null)
      clearStoredTokens()

      // Force navigation on error
      window.location.href = "/login"
    } finally {
      setLoading(false)
    }
  }

  return <AuthContext.Provider value={{ user, loading, signIn, signOut }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
