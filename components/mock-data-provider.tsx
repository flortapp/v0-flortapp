"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import api from "@/services/api"

export function MockDataProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false)
  const { toast } = useToast()
  const isUsingMockData = api.isMockData

  useEffect(() => {
    const initializeData = async () => {
      try {
        if (isUsingMockData) {
          // The mock data is already initialized in api-mock.ts
          toast({
            title: "Development Mode",
            description: "Using mock data for local development",
          })
        } else {
          // When using real API, we might want to fetch initial data
          toast({
            title: "Production Mode",
            description: "Connected to real backend API",
          })
        }
        setIsInitialized(true)
      } catch (error) {
        console.error("Failed to initialize data:", error)
        toast({
          title: "Error",
          description: "Failed to initialize application data",
          variant: "destructive",
        })
        setIsInitialized(true) // Continue anyway to avoid blocking the UI
      }
    }

    initializeData()
  }, [toast, isUsingMockData])

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Initializing application data...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
