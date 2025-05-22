"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import analyticsService from "@/services/analytics-service"
import { useFeature } from "./use-feature"

/**
 * Hook to track page views and provide analytics tracking functions
 * @returns Object with trackEvent function
 */
export function useAnalytics() {
  const pathname = usePathname()
  const isAnalyticsEnabled = useFeature("ENABLE_ANALYTICS")

  // Track page views
  useEffect(() => {
    if (isAnalyticsEnabled) {
      analyticsService.trackPageView(pathname)
    }
  }, [pathname, isAnalyticsEnabled])

  return {
    trackEvent: (eventName: string, properties?: Record<string, any>) => {
      if (isAnalyticsEnabled) {
        analyticsService.trackEvent(eventName, properties)
      }
    },
  }
}

export default useAnalytics
