"use client"

import { useState, useEffect } from "react"
import notificationService, { type Notification } from "@/services/notification-service"
import { useFeature } from "./use-feature"

/**
 * Hook to access and manage notifications
 * @returns Object with notifications and methods to manage them
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const isNotificationsEnabled = useFeature("ENABLE_NOTIFICATIONS")

  useEffect(() => {
    if (!isNotificationsEnabled) {
      setNotifications([])
      return
    }

    // Initial load
    setNotifications(notificationService.getNotifications())

    // Subscribe to updates
    const unsubscribe = notificationService.subscribe((updatedNotifications) => {
      setNotifications(updatedNotifications)
    })

    return unsubscribe
  }, [isNotificationsEnabled])

  return {
    notifications,
    unreadCount: notificationService.getUnreadCount(),
    markAsRead: (id: string) => notificationService.markAsRead(id),
    markAllAsRead: () => notificationService.markAllAsRead(),
    addNotification: (notification: Omit<Notification, "id" | "timestamp">) =>
      notificationService.addNotification(notification),
    isEnabled: notificationService.isEnabled(),
  }
}

export default useNotifications
