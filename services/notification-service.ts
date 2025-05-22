import { FEATURES } from "@/config/feature-flags"

// Types for notifications
export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  timestamp: Date
}

// Mock notification service
class NotificationService {
  private enabled: boolean
  private notifications: Notification[] = []
  private listeners: Set<(notifications: Notification[]) => void> = new Set()

  constructor() {
    this.enabled = FEATURES.ENABLE_NOTIFICATIONS

    // Add some mock notifications if enabled
    if (this.enabled) {
      this.addMockNotifications()
    }
  }

  private addMockNotifications(): void {
    this.notifications = [
      {
        id: "1",
        title: "Welcome to the Admin Panel",
        message: "Thank you for using our admin panel. Let us know if you have any questions.",
        type: "info",
        read: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      },
      {
        id: "2",
        title: "New User Registered",
        message: "A new user has registered on the platform.",
        type: "success",
        read: true,
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      },
      {
        id: "3",
        title: "System Maintenance",
        message: "The system will undergo maintenance in 24 hours. Please save your work.",
        type: "warning",
        read: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      },
    ]
  }

  public getNotifications(): Notification[] {
    if (!this.enabled) {
      return []
    }
    return [...this.notifications]
  }

  public getUnreadCount(): number {
    if (!this.enabled) {
      return 0
    }
    return this.notifications.filter((n) => !n.read).length
  }

  public markAsRead(id: string): void {
    if (!this.enabled) {
      return
    }

    const notification = this.notifications.find((n) => n.id === id)
    if (notification) {
      notification.read = true
      this.notifyListeners()
    }
  }

  public markAllAsRead(): void {
    if (!this.enabled) {
      return
    }

    this.notifications.forEach((n) => (n.read = true))
    this.notifyListeners()
  }

  public addNotification(notification: Omit<Notification, "id" | "timestamp">): void {
    if (!this.enabled) {
      if (FEATURES.DEBUG_MODE) {
        console.warn("Notification not added because notifications are disabled:", notification)
      }
      return
    }

    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substring(2, 11),
      timestamp: new Date(),
    }

    this.notifications.unshift(newNotification)
    this.notifyListeners()

    if (FEATURES.DEBUG_MODE) {
      console.log("Notification added:", newNotification)
    }
  }

  public subscribe(listener: (notifications: Notification[]) => void): () => void {
    this.listeners.add(listener)

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener)
    }
  }

  private notifyListeners(): void {
    const notifications = this.getNotifications()
    this.listeners.forEach((listener) => listener(notifications))
  }

  public isEnabled(): boolean {
    return this.enabled
  }
}

// Export a singleton instance
export const notificationService = new NotificationService()

export default notificationService
