import type { Message } from "@/types/message"
import { liveChatService } from "./live-chat-service"

export interface QueuedMessage {
  id: string
  conversationId: string
  message: any
  attempts: number
  maxAttempts: number
  timestamp: Date
  status: "pending" | "processing" | "completed" | "failed"
  error?: string
}

export class MessageQueueService {
  private static instance: MessageQueueService
  private messageQueue: QueuedMessage[] = []
  private isProcessing = false
  private processingInterval: NodeJS.Timeout | null = null
  private listeners: Array<(queue: QueuedMessage[]) => void> = []
  private readonly MAX_ATTEMPTS = 3
  private readonly PROCESSING_INTERVAL = 300 // ms
  private queue: QueuedMessage[] = []
  private retryDelay = 2000 // ms to wait before retrying
  private intervalId: NodeJS.Timeout | null = null

  private constructor() {
    // Private constructor for singleton pattern
    // Start processing the queue when the service is instantiated
    this.startProcessing()
  }

  public static getInstance(): MessageQueueService {
    if (!MessageQueueService.instance) {
      MessageQueueService.instance = new MessageQueueService()
    }
    return MessageQueueService.instance
  }

  public startProcessing(): void {
    if (this.processingInterval) return

    this.processingInterval = setInterval(() => {
      this.processNextMessage()
    }, this.PROCESSING_INTERVAL)

    console.log("Message queue processing started")
  }

  public stopProcessing(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval)
      this.processingInterval = null
      console.log("Message queue processing stopped")
    }
  }

  public enqueueMessage(
    conversationId: string,
    message: Omit<Message, "id" | "time" | "read">,
    priority = false,
  ): string {
    const id = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

    const queuedMessage: QueuedMessage = {
      id,
      conversationId,
      message,
      attempts: 0,
      maxAttempts: this.MAX_ATTEMPTS,
      timestamp: new Date(),
      status: "pending",
    }

    if (priority) {
      // Add high priority messages to the front of the queue
      this.messageQueue.unshift(queuedMessage)
    } else {
      // Add normal priority messages to the end of the queue
      this.messageQueue.push(queuedMessage)
    }

    this.notifyListeners()

    // Start processing if not already started
    if (!this.processingInterval) {
      this.startProcessing()
    }

    return id
  }

  public getQueue(): QueuedMessage[] {
    return [...this.messageQueue]
  }

  public getQueueLength(): number {
    return this.messageQueue.length
  }

  public getMessageById(id: string): QueuedMessage | undefined {
    return this.messageQueue.find((msg) => msg.id === id)
  }

  public removeMessage(id: string): boolean {
    const initialLength = this.messageQueue.length
    this.messageQueue = this.messageQueue.filter((msg) => msg.id !== id)

    const removed = initialLength > this.messageQueue.length
    if (removed) {
      this.notifyListeners()
    }

    return removed
  }

  public clearQueue(): void {
    this.messageQueue = []
    this.notifyListeners()
  }

  public addListener(listener: (queue: QueuedMessage[]) => void): () => void {
    this.listeners.push(listener)

    // Return function to remove listener
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  private notifyListeners(): void {
    const queueSnapshot = this.getQueue()
    this.listeners.forEach((listener) => listener(queueSnapshot))
  }

  private async processNextMessage(): Promise<void> {
    if (this.isProcessing || this.messageQueue.length === 0) return

    this.isProcessing = true

    // Get the next pending message
    const messageIndex = this.messageQueue.findIndex((msg) => msg.status === "pending")

    if (messageIndex === -1) {
      this.isProcessing = false
      return
    }

    const message = this.messageQueue[messageIndex]

    // Update status to processing
    this.messageQueue[messageIndex] = {
      ...message,
      status: "processing",
      attempts: message.attempts + 1,
    }

    this.notifyListeners()

    try {
      // Dispatch event for message sending
      if (typeof window !== "undefined") {
        const sendEvent = new CustomEvent("messageSend", {
          detail: {
            source: "admin",
            target: "user",
            content: message.message.content,
            metadata: {
              conversationId: message.conversationId,
              messageId: message.id,
            },
          },
        })
        window.dispatchEvent(sendEvent)
      }

      // Simulate message processing with a delay
      await new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          // Simulate random failures (10% chance)
          if (Math.random() < 0.1) {
            reject(new Error("Simulated random message failure"))
          } else {
            resolve()
          }
        }, 500)
      })

      // Update message status to completed
      const updatedIndex = this.messageQueue.findIndex((msg) => msg.id === message.id)
      if (updatedIndex !== -1) {
        this.messageQueue[updatedIndex] = {
          ...this.messageQueue[updatedIndex],
          status: "completed",
        }

        // Dispatch event for message received
        if (typeof window !== "undefined") {
          const receiveEvent = new CustomEvent("messageReceive", {
            detail: {
              source: "admin",
              target: "user",
              content: message.message.content,
              metadata: {
                conversationId: message.conversationId,
                messageId: message.id,
              },
            },
          })
          window.dispatchEvent(receiveEvent)
        }
      }
    } catch (error) {
      // Handle error
      const updatedIndex = this.messageQueue.findIndex((msg) => msg.id === message.id)

      if (updatedIndex !== -1) {
        const updatedMessage = this.messageQueue[updatedIndex]

        if (updatedMessage.attempts >= updatedMessage.maxAttempts) {
          // Max attempts reached, mark as failed
          this.messageQueue[updatedIndex] = {
            ...updatedMessage,
            status: "failed",
            error: error instanceof Error ? error.message : "Unknown error",
          }

          // Dispatch error event
          if (typeof window !== "undefined") {
            const errorEvent = new CustomEvent("messageError", {
              detail: {
                source: "admin",
                target: "user",
                error: error instanceof Error ? error.message : "Unknown error",
                metadata: {
                  conversationId: message.conversationId,
                  messageId: message.id,
                },
              },
            })
            window.dispatchEvent(errorEvent)
          }
        } else {
          // Reset to pending for retry
          this.messageQueue[updatedIndex] = {
            ...updatedMessage,
            status: "pending",
          }
        }
      }
    } finally {
      this.isProcessing = false
      this.notifyListeners()
    }
  }

  public getStats(): {
    total: number
    pending: number
    processing: number
    completed: number
    failed: number
    avgProcessingTime: number
  } {
    const total = this.messageQueue.length
    const pending = this.messageQueue.filter((msg) => msg.status === "pending").length
    const processing = this.messageQueue.filter((msg) => msg.status === "processing").length
    const completed = this.messageQueue.filter((msg) => msg.status === "completed").length
    const failed = this.messageQueue.filter((msg) => msg.status === "failed").length

    // Calculate average processing time for completed messages
    const completedMessages = this.messageQueue.filter((msg) => msg.status === "completed")
    const totalProcessingTime = completedMessages.reduce((sum, msg) => {
      const processingTime = new Date().getTime() - msg.timestamp.getTime()
      return sum + processingTime
    }, 0)

    const avgProcessingTime = completedMessages.length > 0 ? totalProcessingTime / completedMessages.length : 0

    return {
      total,
      pending,
      processing,
      completed,
      failed,
      avgProcessingTime,
    }
  }

  // Add a message to the queue
  enqueueMessage(conversationId: string, message: any, highPriority = false, maxRetries = 3): string {
    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

    const queuedMessage: QueuedMessage = {
      id: messageId,
      conversationId,
      message,
      priority: highPriority ? 1 : 0,
      timestamp: Date.now(),
      retryCount: 0,
      maxRetries,
      status: "pending",
    }

    this.queue.push(queuedMessage)

    // Sort the queue by priority (high to low) and then by timestamp (old to new)
    this.queue.sort((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority
      }
      return a.timestamp - b.timestamp
    })

    console.log(`Message ${messageId} added to queue for conversation ${conversationId}`)

    return messageId
  }

  // Start processing the queue
  startProcessing(): void {
    if (this.intervalId) {
      return // Already processing
    }

    this.intervalId = setInterval(() => {
      this.processNextMessage()
    }, this.processingInterval)

    console.log("Message queue processing started")
  }

  // Stop processing the queue
  stopProcessing(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
      console.log("Message queue processing stopped")
    }
  }

  // Process the next message in the queue
  private async processNextMessage(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) {
      return
    }

    this.isProcessing = true

    try {
      const nextMessage = this.queue[0]

      // Skip messages that are already being processed
      if (nextMessage.status === "processing") {
        this.isProcessing = false
        return
      }

      // Update status to processing
      nextMessage.status = "processing"

      try {
        // Send the message
        const result = await liveChatService.sendMessage(nextMessage.conversationId, nextMessage.message)

        // Message sent successfully
        nextMessage.status = "completed"
        this.queue.shift() // Remove from queue

        console.log(`Message ${nextMessage.id} sent successfully to conversation ${nextMessage.conversationId}`)

        // Dispatch success event
        this.dispatchMessageEvent("messageSuccess", {
          messageId: nextMessage.id,
          conversationId: nextMessage.conversationId,
          result,
        })
      } catch (error) {
        console.error(`Error sending message ${nextMessage.id}:`, error)

        // Increment retry count
        nextMessage.retryCount++

        if (nextMessage.retryCount >= nextMessage.maxRetries) {
          // Max retries reached, mark as failed
          nextMessage.status = "failed"
          this.queue.shift() // Remove from queue

          console.log(`Message ${nextMessage.id} failed after ${nextMessage.maxRetries} retries`)

          // Dispatch error event
          this.dispatchMessageEvent("messageError", {
            messageId: nextMessage.id,
            conversationId: nextMessage.conversationId,
            error,
            content: nextMessage.message.content,
          })
        } else {
          // Retry later
          nextMessage.status = "pending"
          nextMessage.timestamp = Date.now() + this.retryDelay

          // Re-sort the queue
          this.queue.sort((a, b) => {
            if (a.priority !== b.priority) {
              return b.priority - a.priority
            }
            return a.timestamp - b.timestamp
          })

          console.log(
            `Will retry message ${nextMessage.id} (attempt ${nextMessage.retryCount + 1} of ${nextMessage.maxRetries})`,
          )
        }
      }
    } finally {
      this.isProcessing = false
    }
  }

  // Get queue statistics
  getQueue
}

// Export singleton instance
export const messageQueueService = MessageQueueService.getInstance()
