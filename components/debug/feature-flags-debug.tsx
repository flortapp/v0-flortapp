"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FEATURES } from "@/config/feature-flags"
import { ENV_CONFIG } from "@/config/env"
import type { JSX } from "react/jsx-runtime"

// Helper function to render nested objects
function renderObject(obj: any, path = ""): JSX.Element {
  return (
    <ul className="list-disc pl-5 space-y-1">
      {Object.entries(obj).map(([key, value]) => {
        const currentPath = path ? `${path}.${key}` : key

        if (typeof value === "object" && value !== null) {
          return (
            <li key={currentPath}>
              <strong>{key}:</strong>
              {renderObject(value, currentPath)}
            </li>
          )
        }

        return (
          <li key={currentPath} className={value ? "text-green-500" : "text-red-500"}>
            {key}: {value ? "Enabled" : "Disabled"}
          </li>
        )
      })}
    </ul>
  )
}

export function FeatureFlagsDebug() {
  const [isVisible, setIsVisible] = useState(false)

  // Only show the debug button if we're not in debug mode and the panel isn't visible
  if (!ENV_CONFIG.APP.DEBUG_MODE && !isVisible) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <Button variant="outline" size="sm" onClick={() => setIsVisible(true)}>
          Show Feature Flags
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 w-80 max-h-[80vh] overflow-auto">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex justify-between items-center">
            <span>Feature Flags</span>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setIsVisible(false)}>
              ×
            </Button>
          </CardTitle>
          <CardDescription className="text-xs">Current feature configuration</CardDescription>
        </CardHeader>
        <CardContent className="text-xs">{renderObject(FEATURES)}</CardContent>
      </Card>
    </div>
  )
}

export default FeatureFlagsDebug
