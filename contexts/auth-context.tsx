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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const supabase = getSupabaseBrowser()
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Error getting session:', error)
          return
        }

        if (session) {
          const userData: User = {
            id: session.user.id,
            email: session.user.email || "",
            username: session.user.email?.split("@")[0] || "",
          }
          setUser(userData)
        }
      } catch (error) {
        console.error('Unexpected error in initializeAuth:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    const supabase = getSupabaseBrowser()
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const userData: User = {
          id: session.user.id,
          email: session.user.email || "",
          username: session.user.email?.split("@")[0] || "",
        }
        setUser(userData)
        router.push('/')
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        router.push('/login')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

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
      await supabase.auth.signOut()
      setUser(null)
      router.push('/login')
    } catch (error) {
      console.error("Error signing out:", error)
      setUser(null)
      router.push('/login')
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
