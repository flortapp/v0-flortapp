import { isFeatureEnabled } from "@/config/feature-flags"

/**
 * Hook to check if a feature is enabled
 * @param featurePath Dot-notation path to the feature flag
 * @returns Boolean indicating if the feature is enabled
 *
 * @example
 * // Check if analytics is enabled
 * const isAnalyticsEnabled = useFeature('ENABLE_ANALYTICS')
 *
 * @example
 * // Check if a nested feature is enabled
 * const isFileShareEnabled = useFeature('CHAT.ENABLE_FILE_SHARING')
 */
export function useFeature(featurePath: string): boolean {
  return isFeatureEnabled(featurePath)
}

export default useFeature
