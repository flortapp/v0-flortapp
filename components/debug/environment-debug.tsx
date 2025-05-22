"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ENV_CONFIG } from "@/config/env"

export function EnvironmentDebug() {
  const [isVisible, setIsVisible] = useState(false)

  if (!ENV_CONFIG.APP.DEBUG_MODE && !isVisible) {
    return (
      <div className="fixed bottom-4 left-48 z-50">
        <Button variant="outline" size="sm" onClick={() => setIsVisible(true)}>
          Show Environment Info
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 left-48 z-50 w-80">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex justify-between items-center">
            <span>Environment Configuration</span>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setIsVisible(false)}>
              ×
            </Button>
          </CardTitle>
          <CardDescription className="text-xs">Current environment variables</CardDescription>
        </CardHeader>
        <CardContent className="text-xs">
          <div className="space-y-2">
            <div>
              <strong>API Configuration:</strong>
              <ul className="list-disc pl-5">
                <li>Using Real API: {ENV_CONFIG.API.USE_REAL_API ? "Yes" : "No"}</li>
                <li>API Base URL: {ENV_CONFIG.API.API_BASE_URL}</li>
                <li>API Timeout: {ENV_CONFIG.API.API_TIMEOUT}ms</li>
              </ul>
            </div>
            <div>
              <strong>Feature Flags:</strong>
              <ul className="list-disc pl-5">
                <li>Analytics: {ENV_CONFIG.FEATURES.ENABLE_ANALYTICS ? "Enabled" : "Disabled"}</li>
                <li>Notifications: {ENV_CONFIG.FEATURES.ENABLE_NOTIFICATIONS ? "Enabled" : "Disabled"}</li>
              </ul>
            </div>
            <div>
              <strong>App Settings:</strong>
              <ul className="list-disc pl-5">
                <li>App Name: {ENV_CONFIG.APP.APP_NAME}</li>
                <li>Debug Mode: {ENV_CONFIG.APP.DEBUG_MODE ? "Enabled" : "Disabled"}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
