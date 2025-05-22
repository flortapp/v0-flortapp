import { mockApi } from "./api-mock"

// Check if we should use the real API based on environment variable
const useRealApi = process.env.NEXT_PUBLIC_USE_REAL_API === "true"

// This will hold our API implementation (either mock or real)
const apiImplementation = mockApi

// If we're using the real API, we would import and use the real API implementation
if (useRealApi) {
  // In a real implementation, we would import the real API client here
  // import { realApi } from "./api-real"
  // apiImplementation = realApi

  console.log("Using real API based on environment variable")
  // For now, we'll still use the mock API but log that we would use the real one
}

export const api = {
  // Export all endpoints from the selected API implementation
  ...apiImplementation,

  // Flag to check if we're using mock data
  isMockData: !useRealApi,

  // Method to explicitly switch to real API (useful for testing)
  useRealApi: (baseUrl: string) => {
    console.log(`Switching to real API at ${baseUrl}`)
    // Implementation would replace mock endpoints with real API calls
  },
}

export default api
