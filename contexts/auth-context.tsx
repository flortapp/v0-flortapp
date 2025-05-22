"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { getSupabaseBrowser } from "@/lib/supabase"
import { useRouter } from "next/navigation"

type User = {
  id: string
  email: string
  username: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const supabase = getSupabaseBrowser()

        // Check if auth methods exist
        if (!supabase.auth || !supabase.auth.getSession) {
          console.error("Supabase auth methods not available")
          setLoading(false)
          return
        }

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          console.error("Error getting session:", sessionError)
          setLoading(false)
          return
        }

        if (session) {
          // Check if session is older than 24 hours
          const lastLoginTime = new Date(session.created_at).getTime()
          const currentTime = new Date().getTime()
          const hoursDiff = (currentTime - lastLoginTime) / (1000 * 60 * 60)

          if (hoursDiff > 24) {
            await supabase.auth.signOut()
            setUser(null)
          } else {
            // Get user data
            const {
              data: { user: supabaseUser },
              error: userError,
            } = await supabase.auth.getUser()

            if (userError) {
              console.error("Error getting user:", userError)
              setLoading(false)
              return
            }

            if (supabaseUser) {
              setUser({
                id: supabaseUser.id,
                email: supabaseUser.email || "",
                username: "Admin", // Hardcoded for now
              })
            }
          }
        }

        setLoading(false)
      } catch (error) {
        console.error("Unexpected error in checkSession:", error)
        setLoading(false)
      }
    }

    checkSession()

    // Listen for auth changes
    try {
      const supabase = getSupabaseBrowser()

      // Check if auth methods exist
      if (!supabase.auth || !supabase.auth.onAuthStateChange) {
        console.error("Supabase auth.onAuthStateChange not available")
        return () => {}
      }

      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log("Auth state changed:", event)

        if (session) {
          setUser({
            id: session.user.id,
            email: session.user.email || "",
            username: "Admin", // Hardcoded for now
          })
        } else {
          setUser(null)
        }

        setLoading(false)
      })

      return () => {
        if (data && data.subscription && data.subscription.unsubscribe) {
          data.subscription.unsubscribe()
        }
      }
    } catch (error) {
      console.error("Error setting up auth listener:", error)
      return () => {}
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const supabase = getSupabaseBrowser()

      // Check if auth methods exist
      if (!supabase.auth || !supabase.auth.signInWithPassword) {
        console.error("Supabase auth.signInWithPassword not available")
        return { error: new Error("Authentication not available") }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (!error && data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || "",
          username: "Admin", // Hardcoded for now
        })

        // Use direct navigation for more reliable redirection
        setTimeout(() => {
          window.location.href = "/"
        }, 1000)
      }

      return { error }
    } catch (err) {
      console.error("Auth error:", err)
      return { error: err }
    }
  }

  const signOut = async () => {
    try {
      const supabase = getSupabaseBrowser()

      // Check if auth methods exist
      if (!supabase.auth || !supabase.auth.signOut) {
        console.error("Supabase auth.signOut not available")
        return
      }

      await supabase.auth.signOut()
      setUser(null)
      router.push("/login")
    } catch (error) {
      console.error("Error signing out:", error)
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
