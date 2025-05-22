import { ENV_CONFIG } from "./env"

// Core feature flags from environment variables
export const CORE_FEATURES = {
  // API related
  USE_REAL_API: ENV_CONFIG.API.USE_REAL_API,

  // Application features
  ENABLE_ANALYTICS: ENV_CONFIG.FEATURES.ENABLE_ANALYTICS,
  ENABLE_NOTIFICATIONS: ENV_CONFIG.FEATURES.ENABLE_NOTIFICATIONS,

  // Development features
  DEBUG_MODE: ENV_CONFIG.APP.DEBUG_MODE,
}

// Extended feature flags with more granular control
// These could eventually move to environment variables as well
export const EXTENDED_FEATURES = {
  // User management features
  USER_MANAGEMENT: {
    ENABLE_BULK_OPERATIONS: true,
    ENABLE_USER_EXPORT: true,
    ENABLE_ADVANCED_FILTERS: true,
  },

  // Bot management features
  BOT_MANAGEMENT: {
    ENABLE_AI_SUGGESTIONS: false, // Disabled by default as it's experimental
    ENABLE_TEMPLATE_LIBRARY: true,
    ENABLE_PERFORMANCE_METRICS: true,
  },

  // Chat features
  CHAT: {
    ENABLE_FILE_SHARING: false, // Disabled until backend support is ready
    ENABLE_VIDEO_CHAT: false, // Future feature
    ENABLE_TYPING_INDICATORS: true,
  },

  // UI features
  UI: {
    ENABLE_DARK_MODE: true,
    ENABLE_ANIMATIONS: true,
    ENABLE_CUSTOM_THEMES: false, // Coming soon
  },

  // Supabase features
  SUPABASE: {
    ENABLE_REALTIME_TOKEN_SYNC: false, // Disabled until implementation is ready
  },
}

// Combined feature flags
export const FEATURES = {
  ...CORE_FEATURES,
  ...EXTENDED_FEATURES,
}

// Feature checking utility function
export function isFeatureEnabled(featurePath: string): boolean {
  const path = featurePath.split(".")
  let current: any = FEATURES

  for (const segment of path) {
    if (current === undefined || current === null) {
      return false
    }
    current = current[segment]
  }

  return !!current
}

export default FEATURES
