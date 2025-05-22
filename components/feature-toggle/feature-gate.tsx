import type { ReactNode } from "react"
import { isFeatureEnabled } from "@/config/feature-flags"

interface FeatureGateProps {
  /**
   * The feature flag to check, using dot notation for nested flags
   * e.g., "ENABLE_ANALYTICS" or "CHAT.ENABLE_FILE_SHARING"
   */
  feature: string

  /**
   * Content to render when the feature is enabled
   */
  children: ReactNode

  /**
   * Optional content to render when the feature is disabled
   */
  fallback?: ReactNode
}

/**
 * Component that conditionally renders content based on feature flags
 */
export function FeatureGate({ feature, children, fallback = null }: FeatureGateProps) {
  const isEnabled = isFeatureEnabled(feature)

  if (isEnabled) {
    return <>{children}</>
  }

  return <>{fallback}</>
}

export default FeatureGate
