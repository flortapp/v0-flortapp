// Environment variable configuration

// API configuration
export const API_CONFIG = {
  USE_REAL_API: process.env.NEXT_PUBLIC_USE_REAL_API === "true",
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.example.com",
  API_TIMEOUT: Number.parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || "5000", 10),
}

// Feature flags
export const FEATURES = {
  ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "true",
  ENABLE_NOTIFICATIONS: process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS === "true",
}

// Application settings
export const APP_CONFIG = {
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || "Date App CMS",
  DEBUG_MODE: process.env.NEXT_PUBLIC_DEBUG_MODE === "true",
}

// Export all configurations
export const ENV_CONFIG = {
  API: API_CONFIG,
  FEATURES,
  APP: APP_CONFIG,
}

export default ENV_CONFIG
